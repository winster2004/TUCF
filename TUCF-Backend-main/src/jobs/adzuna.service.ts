import {
  BadGatewayException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  ServiceUnavailableException,
  UnauthorizedException,
  HttpStatus,
} from '@nestjs/common';
import axios from 'axios';
import { AxiosError } from 'axios';

type AdzunaResponse = {
  results?: any[];
  count?: number;
  [key: string]: any;
};

type AdzunaSearchResult = {
  data: AdzunaResponse;
  diagnostics: {
    usedFallbackWithoutWhere: boolean;
    reason?: string;
  };
};

@Injectable()
export class AdzunaService {
  private readonly BASE_URL = 'https://api.adzuna.com/v1/api/jobs';
  private readonly REQUEST_TIMEOUT_MS = 10000; // Fix: avoid hanging HTTP calls.
  private readonly RESULTS_PER_PAGE = 10; // Fix: keep pagination behavior predictable.

  // Fix: verify env is loaded and credentials exist before making remote calls.
  private getCredentials() {
    const appId = process.env.ADZUNA_APP_ID;
    const appKey = process.env.ADZUNA_API_KEY;

    console.log('[Adzuna] ENV diagnostics', {
      hasAppId: Boolean(appId),
      hasApiKey: Boolean(appKey),
      nodeEnv: process.env.NODE_ENV ?? 'undefined',
    });

    if (!appId || !appKey) {
      throw new ServiceUnavailableException(
        'Adzuna API credentials are missing. Check ADZUNA_APP_ID and ADZUNA_API_KEY in your environment.',
      );
    }

    return { appId, appKey };
  }

  // Fix: centralized request execution with timeout, logging, and error classification.
  private async fetchAdzuna(
    query: string,
    page: number,
    location?: string,
  ): Promise<{ data: AdzunaResponse; status: number }> {
    const { appId, appKey } = this.getCredentials();
    const url = `${this.BASE_URL}/in/search/${page}`;
    const params: Record<string, string | number> = {
      app_id: appId,
      app_key: appKey,
      what: query,
      results_per_page: this.RESULTS_PER_PAGE,
    };

    if (location && location.trim()) {
      params.where = location;
    }

    console.log('[Adzuna] Request params', {
      url,
      params: {
        ...params,
        app_id: '***masked***',
        app_key: '***masked***',
      },
    });

    try {
      const response = await axios.get<AdzunaResponse>(url, {
        params,
        timeout: this.REQUEST_TIMEOUT_MS,
      });

      // Fix: log metadata from raw provider response for production diagnostics.
      console.log('[Adzuna] Response metadata', {
        status: response.status,
        hasResultsArray: Array.isArray(response.data?.results),
        resultCountInPage: Array.isArray(response.data?.results)
          ? response.data.results.length
          : 0,
        totalCount: response.data?.count ?? null,
        rateLimitRemaining:
          response.headers?.['x-ratelimit-remaining'] ??
          response.headers?.['x-rate-limit-remaining'] ??
          null,
      });

      if (!response.data || typeof response.data !== 'object') {
        throw new BadGatewayException(
          'Adzuna returned an invalid response payload.',
        );
      }

      // Fix: detect possible upstream format changes instead of crashing on mapping.
      if (!('results' in response.data)) {
        console.warn('[Adzuna] Possible API format change detected', {
          responseKeys: Object.keys(response.data),
        });
      }

      return { data: response.data, status: response.status };
    } catch (error) {
      // Fix: classify known provider failure modes (credentials, throttling, timeout, etc.).
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<any>;
        const status = axiosError.response?.status;
        const providerData = axiosError.response?.data;

        console.error('[Adzuna] Request failed', {
          status,
          code: axiosError.code,
          message: axiosError.message,
          data: providerData,
        });

        if (status === 401 || status === 403) {
          throw new UnauthorizedException(
            'Adzuna credentials are invalid or unauthorized.',
          );
        }

        if (status === 429) {
          throw new HttpException(
            'Adzuna API rate limit exceeded. Please retry shortly.',
            HttpStatus.TOO_MANY_REQUESTS,
          );
        }

        if (axiosError.code === 'ECONNABORTED') {
          throw new ServiceUnavailableException(
            'Adzuna request timed out. Please retry.',
          );
        }

        throw new BadGatewayException(
          `Adzuna request failed${
            status ? ` with status ${status}` : ''
          }. Please try again later.`,
        );
      }

      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException(
        'Unexpected error while fetching Adzuna jobs.',
      );
    }
  }

  async searchJobs(query: string, location: string, page = 1): Promise<AdzunaSearchResult> {
    const firstAttempt = await this.fetchAdzuna(query, page, location);
    const firstResults = Array.isArray(firstAttempt.data?.results)
      ? firstAttempt.data.results
      : [];

    // Fix: detect empty provider responses and apply fallback query without location filter.
    if (firstResults.length === 0) {
      console.warn('[Adzuna] Empty result set from first attempt', {
        query,
        location,
        page,
      });

      if (location && location.trim()) {
        const fallback = await this.fetchAdzuna(query, page);
        const fallbackResults = Array.isArray(fallback.data?.results)
          ? fallback.data.results
          : [];

        if (fallbackResults.length > 0) {
          console.warn('[Adzuna] Fallback without "where" returned results', {
            query,
            originalLocation: location,
            page,
            fallbackResultCount: fallbackResults.length,
          });
        } else {
          console.warn('[Adzuna] Fallback without "where" is also empty', {
            query,
            originalLocation: location,
            page,
          });
        }

        return {
          data: fallback.data,
          diagnostics: {
            usedFallbackWithoutWhere: true,
            reason: 'Primary request returned zero results with where filter.',
          },
        };
      }
    }

    return {
      data: firstAttempt.data,
      diagnostics: {
        usedFallbackWithoutWhere: false,
      },
    };
  }

  // Fix: temporary raw debug helper for controller endpoint.
  async debugSearchJobs(query: string, location: string, page = 1) {
    return this.searchJobs(query, location, page);
  }
}
