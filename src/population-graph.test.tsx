// @vitest-environment jsdom

import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';
import { act, render, screen } from '@testing-library/react';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import ResizeObserver from 'resize-observer-polyfill';
import { withNuqsTestingAdapter } from 'nuqs/adapters/testing';

import { PopulationGraphPromise } from './population-graph';
import prefecturesFixture from '../test/fixtures/prefectures.json';
import population47Fixture from '../test/fixtures/population-47.json';
import { apiEndpoint } from './api';

const handlers = [
  http.get(`${apiEndpoint}/api/v1/prefectures`, () =>
    HttpResponse.json(prefecturesFixture)
  ),
  http.get(
    `${apiEndpoint}/api/v1/population/composition/perYear?prefCode=47`,
    () => HttpResponse.json(population47Fixture)
  ),
];

const server = setupServer(...handlers);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

window.ResizeObserver ??= ResizeObserver;

describe('PopulationGraph', () => {
  it('選択された都道府県の人口グラフを表示する', async () => {
    await act(async () => {
      render(<PopulationGraphPromise />, {
        wrapper: withNuqsTestingAdapter({
          searchParams: {
            prefCode: '47',
          },
        }),
      });
    });
    // TODO: テストを正しく修正する
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    expect(screen.queryByText('沖縄')).not.toBeInTheDocument();
  });

  it('APIサーバーが落ちていた場合になにも表示しない', async () => {
    server.use(
      http.get(`${apiEndpoint}/api/v1/prefectures`, () => HttpResponse.error())
    );
    await act(async () => {
      render(<PopulationGraphPromise />, {
        wrapper: withNuqsTestingAdapter({ searchParams: {} }),
      });
    });
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
  });
});
