import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";

describe("Navbar Component", () => {
  it("renders the navigation links correctly", () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    // Check for brand or app title
    expect(screen.getByText(/Restaurant/i)).toBeInTheDocument();

    // Check for main navigation links
    expect(screen.getByText(/Customers/i)).toBeInTheDocument();
    expect(screen.getByText(/Orders/i)).toBeInTheDocument();
  });
});
