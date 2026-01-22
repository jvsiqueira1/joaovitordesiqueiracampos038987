import { TutoresFacade } from "./tutores.facade";
import { listTutores } from "./tutores.service";

vi.mock("./tutores.service", () => ({
  listTutores: vi.fn(),
}));

function makeTutor(i: number) {
  return {
    id: String(i),
    nome: i % 2 === 0 ? `João ${i}` : `Maria ${i}`,
    telefone: `659999999999`,
  };
}

describe("TutoresFacade", () => {
  beforeEach(() => vi.clearAllMocks());

  it("filters locally and paginates during search", async () => {
    const items = Array.from({ length: 25 }, (_, i) => makeTutor(i + 1));

    (listTutores as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      items,
      total: items.length,
      page: 0,
      size: 100,
    });

    const facade = new TutoresFacade();

    await facade.setQuery("João");

    const snapshot1 = facade.getSnapshot();
    expect(snapshot1.total).toBe(12);
    expect(snapshot1.items.length).toBe(10);

    await facade.nextPage();
    const snapshot2 = facade.getSnapshot();
    expect(snapshot2.items.length).toBe(2);
  });
});
