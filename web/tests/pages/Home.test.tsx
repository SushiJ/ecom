import { MemoryRouter } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import { vi, beforeEach, type Mock } from "vitest";
import { Provider } from "react-redux";
import Home from "@/pages/Home";
import { store } from "@/store";
import { useGetProductsQuery, useGetTopProductsQuery } from "@/features/products/slice";

vi.mock("@/features/products/slice", () => ({
  useGetProductsQuery: vi.fn(),
  useGetTopProductsQuery: vi.fn(),
}));

const mockGetProductsQuery = (ReturnValue: any) => {
  (useGetProductsQuery as unknown as Mock).mockReturnValue(ReturnValue);
};

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <Provider store={store}>
    <MemoryRouter>{children}</MemoryRouter>
  </Provider>
);

describe("Home component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders loader when state is loading", () => {
    mockGetProductsQuery({
      data: null,
      isLoading: true,
      isError: false,
    });

    render(<Home skipDelay />, { wrapper: Wrapper });
    expect(screen.getByRole("loading")).toBeInTheDocument();
  });

  it("renders error message on failure", () => {
    mockGetProductsQuery({
      data: null,
      isLoading: false,
      isError: true,
    });

    render(<Home skipDelay />, { wrapper: Wrapper });
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  it("renders empty message when no products", () => {
    mockGetProductsQuery({
      data: { products: [], pages: 1, page: 1 },
      isLoading: false,
      isError: false,
    });

    render(<Home skipDelay />, { wrapper: Wrapper });
    expect(screen.getByRole("empty")).toBeInTheDocument();
  });

  it("renders product list when data exists", () => {
    mockGetProductsQuery({
      data: {
        products: [
          {
            _id: "1",
            name: "Test Product",
            description: "Test Description",
            price: 99,
            rating: 4,
            numReviews: 2,
            image: "/test.jpg",
          },
        ],
        pages: 1,
        page: 1,
      },
      isLoading: false,
      isError: false,
    });
    (useGetTopProductsQuery as unknown as Mock).mockReturnValue({
      products: [
        {
          _id: "1",
          name: "TOP PRODUCT",
          description: "Test Description",
          price: 99,
          rating: 4,
          numReviews: 2,
          image: "/test.jpg",
        },
        {
          _id: "2",
          name: "TOP PRODUCT",
          description: "Test Description",
          price: 99,
          rating: 4,
          numReviews: 2,
          image: "/test.jpg",
        },
      ],
    });

    render(<Home skipDelay />, { wrapper: Wrapper });
    expect(screen.getByText("Latest Products")).toBeInTheDocument();
    expect(screen.getByText("Test Product")).toBeInTheDocument();
    expect(screen.getByText("$ 99")).toBeInTheDocument();
  });
});
