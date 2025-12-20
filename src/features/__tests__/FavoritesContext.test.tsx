import { renderHook, act } from "@testing-library/react";
import { FavoritesProvider, useFavorites } from "../favorites/FavoritesContext";
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <FavoritesProvider>{children}</FavoritesProvider>
);

describe("FavoritesContext", () => {
  it("adds and removes favorites", () => {
    const { result } = renderHook(() => useFavorites(), { wrapper });

    act(() => {
      result.current.toggle(1);
    });

    expect(result.current.isFavorite(1)).toBe(true);

    act(() => {
      result.current.toggle(1);
    });

    expect(result.current.isFavorite(1)).toBe(false);
  });
});