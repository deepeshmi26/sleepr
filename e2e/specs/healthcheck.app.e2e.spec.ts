import { ping } from "tcp-ping";
describe('Healthcheck', () => {
    test("reservations", async () => {
        const response = await fetch(`http://reservations:3000`);
        expect(response.ok).toBe(true);
    })
    test("auth", async () => {
        const response = await fetch(`http://auth:3000`);
        expect(response.ok).toBe(true);
    })

    test("payments", (done) => {
        ping({ address: "payments", port: 3000 }, (err) => {
            if (err) {
                fail();
            }
            done();
        });
    })

    test("notifications", (done) => {
        ping({ address: "notifications", port: 3000 }, (err) => {
            if (err) {
                fail();
            }
            done();
        });
    })
});