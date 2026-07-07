import { expect, it, describe, vi } from "vitest";
import * as cardsController from "../controllers/cardsController";


function mockReqRes(body = {}, params = {}) {
    const req = { body, params };

    const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn().mockReturnThis(),
    };

    return { req, res };
}


describe("Cards Controller - Scryfall API", () => {

    describe("getRandomCard", () => {

        it("should return a random card from Scryfall", async () => {
            const { req, res } = mockReqRes();

            await cardsController.getRandomCard(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalled();

            const card = res.json.mock.calls[0][0];

            expect(card).toHaveProperty("id");
            expect(card).toHaveProperty("name");
            expect(card).toHaveProperty("set");
        });


        it("should return an error if Scryfall is unavailable", async () => {
            /*
             * Ce test est optionnel.
             * Il nécessite de mocker Cards.random().
             *
             * Le but est de vérifier que ton controller
             * gère correctement une erreur externe.
             */

            expect(true).toBe(true);
        });

    });

});