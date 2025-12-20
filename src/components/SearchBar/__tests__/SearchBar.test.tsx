import { render, screen, fireEvent } from "@testing-library/react";
import { SearchBar } from "../SearchBar";

describe("SearchBar", () => {
  it("renders and calls onChange", () => {
    const onChange = vi.fn();

    render(<SearchBar value="" onChange={onChange} resultsCount={10} />);

    const input = screen.getByPlaceholderText(/search/i);
    fireEvent.change(input, { target: { value: "spider" } });

    expect(onChange).toHaveBeenCalledWith("spider");
  });
});