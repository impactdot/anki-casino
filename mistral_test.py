import os
import json
from datetime import datetime
from mistralai import Mistral  # Ensure this import is correct based on your Mistral package

def generate_flashcards():
    flashcards = []
    
    # Collect user input
    topic = input("Enter the topic of the flashcards: ").strip()
    while True:
        number_input = input("Enter the number of flashcards you want to generate: ").strip()
        if number_input.isdigit() and int(number_input) > 0:
            number = int(number_input)
            break
        else:
            print("Please enter a valid positive integer for the number of flashcards.")
    
    # Retrieve API key from environment variable for security
    api_key = "wjJKh2KEYQ7ALYbrbbFnDspPpxLxfYsT"
    if not api_key:
        print("Error: API key not found. Please set the MISTRAL_API_KEY environment variable.")
        return flashcards
    
    model = "mistral-large-latest"
    
    # Initialize the Mistral client
    try:
        client = Mistral(api_key=api_key)
    except Exception as e:
        print(f"Failed to initialize Mistral client: {e}")
        return flashcards
    
    # Craft the prompt to request JSON-formatted flashcards
    prompt = (
        f"You are a flashcard generator. Create {number} flashcards on the topic '{topic}'. "
        "Return the flashcards as a JSON array where each flashcard has 'front' and 'back' fields. "
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
        return flashcards
    
    # Extract the response content
    try:
        response_content = chat_response.choices[0].message.content.strip()
    except (AttributeError, IndexError) as e:
        print(f"Unexpected API response structure: {e}")
        print("Full response:", chat_response)
        return flashcards
    
    # Attempt to parse the response as JSON
    try:
        flashcard_data = json.loads(response_content)
        
        # Validate that the response is a list of dictionaries
        if isinstance(flashcard_data, list):
            for idx, card in enumerate(flashcard_data, start=1):
                front = card.get('front')
                back = card.get('back')
                if front and back:
                    flashcards.append({'front': front, 'back': back})
                else:
                    print(f"Warning: Flashcard {idx} is missing 'front' or 'back' field.")
        else:
            print("Error: The response JSON is not a list.")
    except json.JSONDecodeError:
        print("Error: Failed to parse the response as JSON.")
        print("Response content:", response_content)
        # Optionally, implement alternative parsing here if JSON fails
    
    return flashcards

def save_flashcards_to_file(flashcards):
    if not flashcards:
        print("No flashcards to save.")
        return
    
    # Get current date and time for filename
    now = datetime.now()
    timestamp = now.strftime("%Y%m%d_%H%M%S")
    filename = f"flashcards_{timestamp}.json"
    filepath = os.path.join(os.getcwd(), filename)  # Saves to the current working directory
    
    # Save flashcards to JSON file
    try:
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(flashcards, f, ensure_ascii=False, indent=4)
        print(f"Flashcards have been successfully saved to '{filepath}'.")
    except Exception as e:
        print(f"Failed to save flashcards to file: {e}")

if __name__ == "__main__":
    flashcards = generate_flashcards()
    save_flashcards_to_file(flashcards)




