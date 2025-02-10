type TimeEntry = {
    clientId: string
    duration: number
    date: string
}

type GetTimeEntriesProps = {
    clientId: string | undefined
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
    data: number | Array<DailyReportEntry>
}

export enum ErrorCode {
    Unknown = 0,
    Unauthorized = 1
}

export type ErrorResponse = {
    code: ErrorCode
}

class API {
    baseURL: string  = 'https://sfyij39l9a.execute-api.eu-north-1.amazonaws.com/dev'

    async getClients(): Promise<(string[] | null)> {
        const path = `${this.baseURL}/clients`
        const parameters = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${localStorage.getItem('accessToken')}`,
            },
        }

        try {
            const response = await fetch(path, parameters)

            if (response.status === 401) {
                return Promise.reject({
                    code: ErrorCode.Unauthorized
                })
            }

            return response.json()
        } catch {
            return Promise.reject({
                code: ErrorCode.Unknown
            })
        }
    }

    async createClient(client: string) {
        const path = `${this.baseURL}/clients?clientId=${client}`
        const parameters = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${localStorage.getItem('accessToken')}`,
            },
            body: JSON.stringify({
                client: client,
            }),
        }

        try {
            const response = await fetch(path, parameters)

            if (response.status === 401) {
                return Promise.reject({
                    code: ErrorCode.Unauthorized
                })
            }

            return response.json()
        } catch {
            return Promise.reject({
                code: ErrorCode.Unknown
            })
        }
    }

    async deleteClient(client: string) {
        const path = `${this.baseURL}/clients?clientId=${client}`
        const parameters = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${localStorage.getItem('accessToken')}`,
            },
        }

        try {
            const response = await fetch(path, parameters)

            if (response.status === 401) {
                return Promise.reject({
                    code: ErrorCode.Unauthorized
                })
            }

            return response.json()
        } catch {
            return Promise.reject({
                code: ErrorCode.Unknown
            })
        }
    }

    async registerTime({ clientId, duration, date }: TimeEntry) {
        const path = `${this.baseURL}/entries`

        const entry = {
            'entries': [
                {
                    'clientId': clientId,
                    'duration': duration,
                    'date': date,
                }
            ]
        }

        const parameters = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${localStorage.getItem('accessToken')}`,
            },
            body: JSON.stringify(entry),
        }

        try {
            const response = await fetch(path, parameters)

            if (response.status === 401) {
                return Promise.reject({
                    code: ErrorCode.Unauthorized
                })
            }

            return response.json()
        } catch {
            return Promise.reject({
                code: ErrorCode.Unknown
            })
        }
    }

    async deleteTimeEntry(entryId: string) {
        const path = `${this.baseURL}/entries?EntryId=${entryId}`
        const parameters = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${localStorage.getItem('accessToken')}`,
            },
        }

        try {
            const response = await fetch(path, parameters)

            if (response.status === 401) {
                return Promise.reject({
                    code: ErrorCode.Unauthorized
                })
            }

            return response.json()
        } catch {
            return Promise.reject({
                code: ErrorCode.Unknown
            })
        }
    }

    getTimeEntriesQueryParams(props: GetTimeEntriesProps): string {
        if (!props.clientId) {
            return new URLSearchParams({
                from: props.from,
                to: props.to,
                mode: props.mode,
            }).toString()
        }

        return new URLSearchParams({
            clientId: props.clientId,
            from: props.from,
            to: props.to,
            mode: props.mode,
        }).toString()
    }

    async getTimeEntries(props: GetTimeEntriesProps): Promise<DailyReportResponse | null> {
        const queryParams = this.getTimeEntriesQueryParams(props)

        const path = `${this.baseURL}/entries?${queryParams}`

        const parameters = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${localStorage.getItem('accessToken')}`,
            },
        }

        try {
            const response = await fetch(path, parameters)

            if (response.status === 401) {
                return Promise.reject({
                    code: ErrorCode.Unauthorized
                })
            }

            return response.json()
        } catch {
            return Promise.reject({
                code: ErrorCode.Unknown
            })
        }
    }
}

export default API