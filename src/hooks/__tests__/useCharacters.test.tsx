import { renderHook, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import { useCharacters } from "../useCharacters";
import * as api from "@/api/comicvine";
import { LoadingProvider } from "@/features/loading/LoadingContext";

vi.mock("@/api/comicvine");

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <LoadingProvider>{children}</LoadingProvider>
);

describe("useCharacters", () => {
  it("loads characters", async () => {
    (api.listCharacters as unknown as vi.Mock).mockResolvedValue({
      items: [{ id: 1, name: "Spider-Man", description: "", imageUrl: "" }],
      total: 1,
    });

    const { result } = renderHook(() => useCharacters(""), { wrapper });

    await waitFor(() => {
      expect(result.current.items.length).toBe(1);
    });
  });
});