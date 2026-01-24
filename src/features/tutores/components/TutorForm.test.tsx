import type { TutorUpsertInput } from "../tutores.models";

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import TutorForm from "./TutorForm";

describe("TutorForm", () => {
    it("should submits trimmed values", async () => {
        const user = userEvent.setup();
        const onSubmit: (data: TutorUpsertInput) => void = vi.fn();

        render(<TutorForm loading={false} onSubmit={onSubmit} initial={{ nome: " João ", telefone: "(11) 99999-9999" }} />);

        await user.clear(screen.getByLabelText(/Nome/i));
        await user.type(screen.getByLabelText(/Nome/i), "  Maria Silva  ");

        await user.clear(screen.getByLabelText(/Telefone/i));
        await user.type(screen.getByLabelText(/Telefone/i), "21988887777");

        await user.clear(screen.getByLabelText(/Email/i));
        await user.type(screen.getByLabelText(/Email/i), "  maria@email.com  ");

        await user.clear(screen.getByLabelText(/Endereço/i));
        await user.type(screen.getByLabelText(/Endereço/i), "  Rua das Flores, 123  ");

        await user.clear(screen.getByLabelText(/CPF/i));
        await user.type(screen.getByLabelText(/CPF/i), "12345678901");

        await user.click(screen.getByRole("button", { name: /salvar/i }));

        expect(onSubmit).toHaveBeenCalledWith({
            nome: "Maria Silva",
            telefone: "(21) 98888-7777",
            email: "maria@email.com",
            endereco: "Rua das Flores, 123",
            cpf: "12345678901",
        });
    });
});
