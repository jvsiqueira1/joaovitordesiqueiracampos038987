import { PetsFacade } from "./pets.facade";
import { listPets } from "./pets.service";

vi.mock("./pets.service", () => ({
  listPets: vi.fn(),
}));

function makePet(i: number) {
  return {
    id: String(i),
    nome: i % 2 === 0 ? `Bob ${i}` : `Rex ${i}`,
    idade: 1,
    raca: "SRD",
  };
}

describe("PetsFacade", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("filters locally when query is set and paginates 10 per page", async () => {
    const items = Array.from({ length: 30 }, (_, i) => makePet(i + 1));

    (listPets as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      items,
      total: items.length,
      page: 0,
      size: 100,
    });

    const facade = new PetsFacade();

    await facade.setQuery("bob");

    const snapshot1 = facade.getSnapshot();
    expect(snapshot1.total).toBe(15);
    expect(snapshot1.items.length).toBe(10);
    expect(snapshot1.items.every((pet) => pet.nome.toLowerCase().includes("bob"))).toBe(true);

    await facade.nextPage();

    const snapshot2 = facade.getSnapshot();
    expect(snapshot2.page).toBe(1);
    expect(snapshot2.items.length).toBe(5);
  });
});
