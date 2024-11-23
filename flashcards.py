import os
import json
from datetime import datetime
from mistralai import Mistral  # Ensure this import is correct based on your Mistral package

def generate_flashcards(topic,number):
    # Initialize variables
    data = {}
    # Retrieve API key from environment variable for security
    api_key = "wjJKh2KEYQ7ALYbrbbFnDspPpxLxfYsT"
    if not api_key:
        print("Error: API key not found. Please set the MISTRAL_API_KEY environment variable.")
        return data
    
    model = "mistral-large-latest"
    
    # Initialize the Mistral client
    try:
        client = Mistral(api_key=api_key)
    except Exception as e:
        print(f"Failed to initialize Mistral client: {e}")
        return data
    
    # Craft the prompt to request theory information and JSON-formatted flashcards
    prompt = (
        f"You are a flashcard generator. First, provide concise theory information about the topic '{topic}' that would help with understanding the flashcards. "
        f"Then, create {number} flashcards on the topic. "
        "Return the theory information and the flashcards as a JSON object, where the 'theory' field contains"
        "information that students would need to read in order to be able to solve the flashcards"
        "and the 'flashcards' field contains an array of flashcards, each with 'front' and 'back' fields. "
        "Do not include any markdown or code block formatting in your response."
    )
    
    # Make the API call
    try:
        chat_response = client.chat.complete(
            model=model,
            messages=[
                {
                    "role": "user",
                    "content": prompt,
                },
            ]
        )
    except Exception as e:
        print(f"API call failed: {e}")
        return data
    
    # Extract the response content
    try:
        response_content = chat_response.choices[0].message.content.strip()
    except (AttributeError, IndexError) as e:
        print(f"Unexpected API response structure: {e}")
        print("Full response:", chat_response)
        return data
    
    # Attempt to parse the response as JSON
    try:
        flashcard_data = json.loads(response_content)
        
        if isinstance(flashcard_data, dict):
            theory = flashcard_data.get('theory')
            flashcards_list = flashcard_data.get('flashcards')
            if theory and isinstance(flashcards_list, list):
                flashcards = []
                for idx, card in enumerate(flashcards_list, start=1):
                    front = card.get('front')
                    back = card.get('back')
                    if front and back:
                        flashcards.append({'front': front, 'back': back})
                    else:
                        print(f"Warning: Flashcard {idx} is missing 'front' or 'back' field.")
                # Store the theory information and the flashcards
                data = {'theory': theory, 'flashcards': flashcards}
            else:
                print("Error: The response JSON does not contain 'theory' or 'flashcards' properly.")
        else:
            print("Error: The response JSON is not a dictionary.")
    except json.JSONDecodeError:
        print("Error: Failed to parse the response as JSON.")
        print("Response content:", response_content)
        # Optionally, implement alternative parsing here if JSON fails
    
    return data

def save_flashcards_to_file(data):
    if not data:
        print("No data to save.")
        return
    
    # Get current date and time for filename
    now = datetime.now()
    timestamp = now.strftime("%Y%m%d_%H%M%S")
    filename = f"flashcards_{timestamp}.json"
    filepath = os.path.join(os.getcwd(), filename)  # Saves to the current working directory
    
    # Save data to JSON file
    try:
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=4)
        print(f"Flashcards have been successfully saved to '{filepath}'.")
    except Exception as e:
        print(f"Failed to save flashcards to file: {e}")

def flashcards(topic, number):
    data = generate_flashcards(topic,number)
    save_flashcards_to_file(data)


