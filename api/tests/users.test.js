import { expect, it, test, vi } from "vitest";
import { followUser, getUserById } from "../controllers/usersController";
import { supabase } from "../services/supabase";
import { describe } from "node:test";


vi.mock("../services/supabase", () => ({
    supabase: {
        rpc: vi.fn(() => Promise.resolve({ data: null, error: null })),
    },
}));


function createMockResponse() {
    const res = {};
    res.status = vi.fn().mockReturnValue(res);
    res.json = vi.fn().mockReturnValue(res);
    return res;
}


describe("followUser", () => {
    it("successfuly follows an user", async () => {
        const req = {
            body: {
                userId: "user-1",
                targetId: "user-2"
            }
        };

        getUserById.mockImplementation(id => {
            if (id === "user-1") return Promise.resolve({ id: "user-1", following: [] });
            if (id === "user-2") return Promise.resolve({ id: "user-2", followers: [] });
        });

        const res = createMockResponse();

        await followUser(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ success: true });
        expect(supabase.rpc).toHaveBeenCalledWith("follow_user", { taregt_user_id: "user-2" });
    })
})


// test("get an user account", async () => {
//     const userId = "8e3c9213-b02f-434f-b2aa-b4a23c0ce5fb";
//     const response = await fetch(`http://localhost:4000/api/users/${userId}`, {
//         method: "GET",
//         headers: { "Content-Type": "application/json" }
//     });

//     const data = await response.json();

//     expect(data).toMatchObject({
//         username: "Elchetibo",
//         email: "chez.tibo84@gmail.com",
//     });
// })


// test("make an user account follow and unfollow another one", async () => {
//     const userId_1 = "8e3c9213-b02f-434f-b2aa-b4a23c0ce5fb";    // "Elchetibo"
//     const userId_2 = "12294f67-2f94-45e4-a7cb-40b57f1b1a2f";    // "RakdosMaster11"

//     const follow = await fetch("http://localhost:4000/api/users/follow", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//             userId: userId_1,
//             targetId: userId_2
//         })
//     });

//     expect(follow.ok).toBeTruthy();

//     const unfollow = await fetch("http://localhost:4000/api/users/unfollow", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//             userId: userId_2
//         })
//     });

//     expect(unfollow.ok).toBeTruthy();
// })