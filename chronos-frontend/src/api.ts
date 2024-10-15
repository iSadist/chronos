type TimeEntry = {
    clientId: string
    duration: number
    date: string
    userId: string
}

type GetTimeEntriesProps = {
    clientId: string
    from: string
    to: string
    mode: string
}

export type DailyReportEntry = {
    ClientId: string
    Date: string
    Duration: number
    EntryId: string
    UserId: string
}

export type DailyReportResponse = {
    from: string
    to: string
    data: Array<DailyReportEntry>
}

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

    async registerTime({ clientId, duration, date, userId }: TimeEntry) {
        const path = `${this.baseURL}/entries`

        const entry = {
            'entries': [
                {
                    'clientId': clientId,
                    'duration': duration,
                    'date': date,
                    'userId': userId,
                }
            ]
        }

        const parameters = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(entry),
        }

        const response = await fetch(path, parameters)

        return response.json()
    }

    async getTimeEntries(props: GetTimeEntriesProps): Promise<DailyReportResponse> {
        const queryParams = new URLSearchParams({
            clientId: props.clientId,
            from: props.from,
            to: props.to,
            mode: props.mode,
            userId: this.userId,
        }).toString()

        const path = `${this.baseURL}/entries?${queryParams}`

        const parameters = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        }

        const response = await fetch(path, parameters)

        return response.json()
    }
}

export default API