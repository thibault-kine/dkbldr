import { afterAll, beforeAll, expect, it, test, vi, describe } from "vitest";
import * as userController from "../controllers/usersController";

// Import du vrai Supabase pour les tests d'intégration
import { supabase } from "../services/supabase";

function mockReqRes(body = {}, params = {}) {
    const req = { body, params };
    const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn().mockReturnThis(),
    };

    return { req, res };
}


let testUserId;

describe("Users Controller - CRUD Operations", () => {

    describe("createUser", () => {
        it("should create a user successfully", async () => {
            const { req, res } = mockReqRes({
                username: "TestUser",
                email: "test@example.com",
                password: "password123",
            });

            await userController.createUser(req, res);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalled();
            
            // Récupérer l'ID du user créé pour les tests suivants
            const call = res.json.mock.calls[0][0];
            if (call && call.id) {
                testUserId = call.id;
            }
        });

        it("should return 500 if required fields are missing", async () => {
            const { req, res } = mockReqRes({
                username: "TestUser"
                // email et password manquants
            });

            await userController.createUser(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe("updateUser", () => {
        it("should update a user successfully", async () => {
            if (!testUserId) {
                const { data, error } = await supabase  
                    .from("users")
                    .select("id")
                    .eq("is_test", true);

                testUserId = data.id;
            }

            const { req, res } = mockReqRes(
                {
                    username: "UpdatedUsername",
                    email: "updated@example.com"
                },
                { userId: testUserId }
            );

            await userController.updateUser(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalled();
        });

        it("should return 500 if user ID is invalid", async () => {
            const { req, res } = mockReqRes(
                { username: "UpdatedUsername" },
                { userId: "invalid-id" }
            );

            await userController.updateUser(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe("deleteUser", () => {
        it("should delete a user successfully", async () => {
            if (!testUserId) {
                const { data, error } = await supabase  
                    .from("users")
                    .select("id")
                    .eq("is_test", true);

                testUserId = data.id;
            }

            const { req, res } = mockReqRes({}, { userId: testUserId });

            await userController.deleteUser(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalled();
        });

        it("should return 500 if user ID is invalid", async () => {
            const { req, res } = mockReqRes({}, { userId: "invalid-id" });

            await userController.deleteUser(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    afterAll(async () => {
        // Nettoyer tous les users de test
        await supabase
            .from("users")
            .delete()
            .eq("is_test", true);
    });
});
