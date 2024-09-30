class API {
    baseURL: string  = 'https://sfyij39l9a.execute-api.eu-north-1.amazonaws.com/dev'
    userId: string = 'Net'

    async getClients(): Promise<[string]> {
        const path = `${this.baseURL}/clients?userId=${this.userId}`
        const parameters = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        }

        const response = await fetch(path, parameters)
        return response.json()
    }

    async createClient(client: string) {
        const path = `${this.baseURL}/clients?userId=${this.userId}&clientId=${client}`
        const parameters = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: this.userId,
                client: client,
            }),
        }

        const response = await fetch(path, parameters)

        return response.json()
    }

    async deleteClient(client: string) {
        const path = `${this.baseURL}/clients?userId=${this.userId}&clientId=${client}`
        const parameters = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        }

        const response = await fetch(path, parameters)

        return response.json()
    }
}

export default API