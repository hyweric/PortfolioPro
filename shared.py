"""
PUT SHARED CODE HERE
SNIPPETS OF CODE FROM THE GOOGLE GENERATIVE AI PACKAGE
$ pip install google-generativeai
"""

import google.generativeai as genai

genai.configure(api_key = "AIzaSyDy_l6-a7EjphUsVq2xJMyQ3pKmha25gWg")

# Set up the model
generation_config = {
  "temperature": 1,
  "top_p": 0.95,
  "top_k": 0,
  "max_output_tokens": 8192,
}

safety_settings = [
  {
    "category": "HARM_CATEGORY_HARASSMENT",
    "threshold": "BLOCK_MEDIUM_AND_ABOVE"
  },
  {
    "category": "HARM_CATEGORY_HATE_SPEECH",
    "threshold": "BLOCK_MEDIUM_AND_ABOVE"
  },
  {
    "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
    "threshold": "BLOCK_MEDIUM_AND_ABOVE"
  },
  {
    "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
    "threshold": "BLOCK_MEDIUM_AND_ABOVE"
  },
]

model = genai.GenerativeModel(model_name="gemini-1.5-pro-latest",
                              generation_config=generation_config,
                              safety_settings=safety_settings)

def generate_content(context, inputPrompt):
    try:
        prompt_parts = [
            context,
            inputPrompt,
            "output: ",
        ]
        response = model.generate_content(prompt_parts)
        return response.text
    except:
        return "Unable to generate"

"""
if __name__ == "__main__":
    inputPrompt = input("Enter your prompt: ")
    print(generate_content("pretend you are stephen hawking, 1 sentence long at max ", inputPrompt))
"""