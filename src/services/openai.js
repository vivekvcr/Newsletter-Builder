import OpenAI from 'openai';

const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

if (!apiKey) {
    console.error("Missing VITE_OPENAI_API_KEY in .env file");
}

const openai = new OpenAI({
    apiKey: apiKey,
    dangerouslyAllowBrowser: true // Required for client-side usage
});

export const generateEmailCode = async (base64Image) => {
    const prompt = `
You are an expert HTML email developer with OCR and visual analysis capability.

I am providing:
1. A design screenshot (Input A)
2. A strict Reference HTML Template (Input B) - SEE BELOW

Your task:
Map the TEXT and VISUAL CONTENT from Input A (Screenshot) onto the CODE STRUCTURE of Input B (Reference HTML).

⚠️ STRUCTURE RULES (ABSOLUTE):
- You MUST use the Reference HTML provided below as your base code.
- Keep the exact class names (e.g., .stack, .px-24, .w-100), media queries, and meta tags.
- Keep the exact nesting (table > tr > td > table).
- Only duplicate rows/sections if the screenshot has more content than the reference.
- Do NOT invent new classes or layout structures unless strictly necessary.

📄 REFERENCE HTML (GOLDEN TEMPLATE):
\`\`\`html
<html>
  <head>
    <meta content="width=device-width, initial-scale=1" />
    <meta content="ie=edge" />
    <title>Newsletter</title>
    <style>
      body { background-color: #eee; }
      @media only screen and (max-width:620px) {
        .w-100 { width: 100% !important }
        .stack { display: block !important; width: 100% !important }
        .p-24 { padding: 24px !important }
        .px-24 { padding-left: 24px !important; padding-right: 24px !important }
        .pt-16 { padding-top: 16px !important }
        .fs-24 { font-size: 24px !important; }
        .btn a { display: block !important }
        .center { text-align: center !important }
        .hide { display: none !important; mso-hide: all !important }
      }
      @media (prefers-color-scheme: dark) { .dark-text { color: #ffffff !important } }
    </style>
  </head>
  <table cellpadding="0" cellspacing="0" border="0" width="100%">
    <tbody>
      <tr>
        <td align="center" style="padding:0px 12px;">
          <table cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width:600px;background:transparent;border-radius:0;overflow:hidden;">
            <!-- Use this container structure for all sections -->
             <tr><td class="px-24" style="padding:30px 50px 5px 50px;">
                <!-- INSERT HEADER CONTENT HERE -->
             </td></tr>
             <!-- Repeat rows for content -->
          </table>
        </td>
      </tr>
    </tbody>
  </table>
</html>
\`\`\`

📝 TEXT EXTRACTION (MANDATORY):
- Extract ALL readable text from the screenshot (Headings, Paragraphs, Buttons, Quotes, Footer).
- ❌ Do NOT invent text. ❌ Do NOT summarize.
- Preserve: Exact wording, Capitalization, Line breaks.
- If text is unclear, use: [Text not legible in screenshot]

🎨 VISUAL DESIGN RULES (STRICT COMPLIANCE):

1. **TYPOGRAPHY (CRITICAL)**:
   - Font Family: \`Lato, Helvetica, sans-serif\` (Default).
   - **MINIMUM FONT SIZE: 16px**. (No exception).
   - ❌ Never use 10px, 12px, 14px for footers/copyrights.
   - ✅ H1: 30px (Bold).
   - ✅ H2: 22px (Bold).
   - ✅ List Items (ul li): 18px.

2. **COLOR PALETTE**:
   - **ACCENT/CTA COLOR: PRECISELY #ff6600**. (Override extracted oranges).
   - Backgrounds/Text: Extract strictly from screenshot.
   - Usage: Use #ff6600 for all Buttons, Links, Heavy Dividers.

3. **LAYOUT & SPACING**:
   - **PADDING**: All primary content \`<td>\`s must have \`style="padding:50px;"\`.
   - **BUTTONS**: Table-based, 100% width, 50px height. (Background on \`<td>\`, Text on \`<a>\`).
   - **IMAGES**: Replace ALL images with placeholders: \`https://placehold.co/600x200\`.

📧 COMPATIBILITY PRIORITY:
1. Outlook(Windows)
2. Gmail
3. Apple Mail
4. Yahoo

📤 OUTPUT RULES:
Return a JSON Object with this structure(NO markdown wrappers):
{
    "html": "<!DOCTYPE html>...",
        "meta": {
        "colors": ["#hex", "#hex"],
            "fonts": ["Font Name 1", "Font Name 2"]
    }
}

✅ FINAL SELF - CHECK(MANDATORY):
-[] Primary accent is #ff6600
    - [] No font size below 16px
        - [] All text uses inline styles
            - [] Layout is table - based
                - [] Padding is 50px
                    - [] Buttons are full - width
                        - [] Email - client safe
                            `;

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                {
                    role: "user",
                    content: [
                        { type: "text", text: prompt },
                        {
                            type: "image_url",
                            image_url: {
                                "url": base64Image,
                                "detail": "high"
                            },
                        },
                    ],
                },
            ],
            response_format: { type: "json_object" },
        });

        const content = response.choices[0].message.content;
        return JSON.parse(content);
    } catch (error) {
        console.error("Error generating email:", error);
        throw error;
    }
};
