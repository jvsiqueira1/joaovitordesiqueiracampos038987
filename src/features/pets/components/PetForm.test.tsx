import type { PetUpsertInput } from "../pets.models";

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import PetForm from "./PetForm";

describe("PetForm", () => {
    it("should submits trimmed values", async () => {
        const user = userEvent.setup();
        const onSubmit: (data: PetUpsertInput) => void = vi.fn();

        render(<PetForm loading={false} onSubmit={onSubmit} initial={{ nome: " Rex ", raca: "SRD", idade: 3 }} />);

        await user.clear(screen.getByLabelText(/Nome/i));
        await user.type(screen.getByLabelText(/Nome/i), "  Bob  ");

        await user.clear(screen.getByLabelText(/Raça/i));
        await user.type(screen.getByLabelText(/Raça/i), "  Vira Lata  ");

        await user.clear(screen.getByLabelText(/Idade/i));
        await user.type(screen.getByLabelText(/Idade/i), "5");

        await user.click(screen.getByRole("button", { name: /salvar/i }));

        expect(onSubmit).toHaveBeenCalledWith({
            nome: "Bob",
            raca: "Vira Lata",
            idade: 5,
        });
    });
});