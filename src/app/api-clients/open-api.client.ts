import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import 'zone.js/dist/zone';

type Role = 'user' | 'system' | 'assistant';

type Message = {
    content: string;
    role: Role;
};

@Injectable({ providedIn: 'root' })
export class OpenAIService {
    /**
    This Angular service method makes a call to the OpenAI API to perform a chat completion.
    It sends a list of messages along with other parameters to the API and receives responses in a streaming manner.
    @param messages - An array of Message objects representing the conversation history.
    @param temperature - Optional parameter that controls the randomness of the generated text. Default value is 0.5.
    @param model - Optional parameter that specifies the model to be used. Default value is 'gpt-3.5-turbo'.
    @param apiKey - The API key for authorization.
    @returns An Observable that emits string values representing the generated text updates from the API.
*/
    public doOpenAICall(
        messages: any[],
        temperature: number = 0.5,
        model: string = 'gpt-3.5-turbo',
        apiKey: string
    ): Observable<string> {
        const url = 'https://api.openai.com/v1/chat/completions';

        return new Observable((observer) => {
            const xhr = new XMLHttpRequest();
            xhr.open('POST', url);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.setRequestHeader('Authorization', 'Bearer ' + apiKey);

            // Callback function that gets called as the response progresses
            xhr.onprogress = () => {
                // Extract new updates from the response text
                const newUpdates = xhr.responseText
                    .replace('data: [DONE]', '')
                    .trim()
                    .split('data: ')
                    .filter(Boolean);

                // Parse the new updates and extract the generated text
                const newUpdatesParsed: string[] = newUpdates.map((update) => {
                    const parsed = JSON.parse(update);
                    if (!!parsed.error) {
                        return parsed.error.message;
                    }
                    return parsed?.choices[0]?.delta?.content || '';
                });

                // Emit the generated text updates to the observer
                observer.next(newUpdatesParsed.join(''));
            };

            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        // Signal completion to the observer
                        observer.complete();
                    } else {
                        // Signal error to the observer
                        observer.error(
                            new Error(
                                'Request failed with status ' + xhr.status
                            )
                        );
                        // observer.next(newUpdatesParsed.join(''));
                    }
                }
            };

            // Send the request to the OpenAI API
            xhr.send(
                JSON.stringify({
                    model,
                    messages,
                    temperature,
                    frequency_penalty: 0,
                    presence_penalty: 0,
                    stream: true, // set this to false if you don't want to have streaming
                })
            );

            // Return a cleanup function that aborts the request if the observer unsubscribes
            return () => {
                xhr.abort();
            };
        });
    }
}
