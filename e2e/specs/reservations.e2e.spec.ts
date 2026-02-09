describe('Reservations', () => {
    let jwt: string;
    beforeAll(async () => {
        const user = {
            email: 'test@test.com',
            password: 'test',
        }

        await fetch(`http://auth:3000/users`, {
            method: 'POST',
            body: JSON.stringify({
                email: 'test@test.com',
                password: 'test',
            }),
            headers: {
                'Content-Type': 'application/json',
            }
        });

        const response = await fetch(`http://auth:3000/auth/login`, {
            method: 'POST',
            body: JSON.stringify(user),
            headers: {
                'Content-Type': 'application/json',
            }
        });

        jwt = await response.json();
    })
    test('Create', async () => {
        const response = await fetch(`http://reservations:3000/reservations`,
            {
                method: 'POST',
                body: JSON.stringify({
                    "startDate": "2026-02-10T00:00:00.000Z",
                    "endDate": "2026-02-15T00:00:00.000Z",
                    "charge": {
                        "card": {
                            "number": "4242424242424242",
                            "exp_month": 12,
                            "exp_year": 2030,
                            "cvc": "123"
                        },
                        "amount": 5000
                    }
                }),
                headers: {
                    'Content-Type': 'application/json',
                    'Authentication': jwt,
                }
            }
        );

        expect(response.ok).toBe(true);
        const reservation = await response.json();
        console.log(reservation);
    })
})