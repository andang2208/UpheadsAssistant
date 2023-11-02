import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class OpenApiClient {
    apiKey = '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'; // Replace with your actual ChatGPT API key
    apiEndpoint = 'https://api.openai.com/v1/chat/completions';

    constructor(private http: HttpClient) {}

    sendMessage(message: string) {
        const headers = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${this.apiKey}`);

        const data = {
            model: 'gpt-3.5-turbo',
            messages: [
                {
                    role: 'user',
                    content: message,
                },
            ],
        };

        return this.http.post(this.apiEndpoint, data, { headers });
    }
}