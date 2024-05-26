"""
PUT SHARED CODE HERE
SNIPPETS OF CODE FROM THE GOOGLE GENERATIVE AI PACKAGE
$ pip install google-generativeai
"""
import google.generativeai as genai
from extractStringInfo import extractResumeInfo

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

# TEMPORARY
job = "doctor"

contextResume = f"""divide resume into 3 pieces into a personal website.
                           You will be provided a resume. Your reply should include an intro, education, job experiences, other experiences/ interests, and job ranting 

                            Example response:
  ## Intro

- NAME: Rishab Kumar Jain
- CONTACT: 123 456 7890 
- WEBSITE: [www.linkedin.com/in/rishab-jain-k](http://www.linkedin.com/in/rishab-jain-k)
- DESCRIPTION: Building ICOR. Harvard '27, TIME's 25 Most Influential Teens (LinkedIn)
- LOCATION: Cambridge, Massachusetts, United States

---

## Education

- SCHOOL: Harvard University
- YEAR: NOT PROVIDED
- MAJOR(S): Computer Science

---

## Job Experiences

### Harvard Innovation Labs

- Building
- September 2023 - Present (9 months)
- https://x.com/codonsai
                           

### Summer Legal Intern

- June 2023 - August 2023 (3 months)
- Developed a comprehensive literature review organizer of post-case research to supplement a petition to the Federal Communications Commission as pertaining to safe exposure levels to radiofrequency radiation.
- Designed the database tool, then presented it to the director of the Environmental Health Trust (client).

---
## Other Experience and Interests

- **Top Skills**: Sustainability, Leadership, Chemistry
- **Honors-Awards**: First Prize Winner - Winner's Recital, Crescendo International Music Competition at Carnegie Hall, Grand Award Winner in Chemistry at ISEF 2022 (Third Award of $1,000), Washington State Delegate at the 2023 AAAS/AJAS Conference, US Senate Youth Program (USSYP) State Delegate for WA State and Recipient of $10,000 Scholarship, Ronald Reagan Leadership Medal
- **Publications**: X-ray Crystallography: Seeding Technique with Cytochrome P450 Reductase, The Innate Role of a Purposeful Life in Civilization, Structural Similarities and Overlapping Activities among Dihydroflavonol 4-Reductase, Flavanone 4-Reductase, and Anthocyanidin Reductase Offer Metabolic Flexibility in the Flavonoid Pathway, Investigating the Correlation between the Blood Type and the Rate of Infection by SARS-CoV-2

---                                
## Rating for Job of ________

5/10
                          
                            label each section- intro (name, contact, website, description, location), education (school, major), job experiences (sections like above), other experience and interests, rating. all sections and subsections must be present but if any additional info is provided that is not related to any of the provided sections, do not include it. There should only be those sections. If some sections are not given, write Not Provided. Rating should always be given.  
                            Do not include like "following this structure, here is the ___" any additional comments regarding the output. divide each header with a divider, each large section is heading 2, subsections are heading 3. give a final rating from 1-10 for the job of {job} and grade strictly like a professional recruiter (leave no additional comments though). make it into bullet points and easily readable, this response should be standard and exactly follow the provided format. make the response directly pastable (to be scraped by computer) so no additional comments"""
 

def generate_resume_dict(input):
  output = generate_content(contextResume, input)
  patternExported = extractResumeInfo(output)
  return patternExported
