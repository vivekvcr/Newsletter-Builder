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
You are an expert HTML email developer.

I am providing:
1. A design screenshot (Input A)
2. A strict Reference HTML Template (Input B)

Your task:
Map the content from the screenshot onto the specific structure of the Reference HTML.

⚠️ HEADER & FOOTER RULES (CRITICAL):
- **HEADER**: MUST be a full-width row with background-color: #000000. It typically contains the Logo centered or left-aligned.
- **FOOTER**: MUST be a full-width row with background-color: #000000 (Black).
    - Text color MUST be #ffffff (White).
    - Links in footer MUST be #ffffff (White).
    - Typically contains: Address, Phone, Privacy Policy, Copyright.
    - Layout: Often 2 columns (Left: Address, Right: Contact) or Centered.

📄 REFERENCE HTML (GOLDEN TEMPLATE):
\`\`\`html
<html>
  <head>
    <meta content="width=device-width, initial-scale=1" />
    <meta content="ie=edge" />
    <title>Newsletter</title>
    <style>
      body { background-color: #eee; font-family: 'Lato', sans-serif; }
      .bg-black { background-color: #000000 !important; color: #ffffff !important; }
      .footer-a { color: #ffffff !important; text-decoration: none; }
      @media only screen and (max-width:620px) {
        .w-100 { width: 100% !important }
        .stack { display: block !important; width: 100% !important }
        .p-24 { padding: 24px !important }
        .px-24 { padding: 0 24px !important }
        .center-m { text-align: center !important }
      }
    </style>
  </head>
  <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#eeeeee;">
    <tbody>
      <tr>
        <td align="center">
          <table cellpadding="0" cellspacing="0" border="0" width="600" style="background:#ffffff; max-width:600px;">
            
            <!-- HEADER SECTION (Always Black Background) -->
            <tr>
              <td class="bg-black p-24" align="center" style="background-color:000000; padding:30px 24px;">
                 <!-- LOGO HERE: Use https://placehold.co/250x60/000000/ffffff?text=WHITE+LABEL+IQ if logo unclear -->
                 <img src="https://placehold.co/250x60/000000/ffffff?text=WHITE+LABEL+IQ" width="250" style="display:block; border:0; color: #ffffff;" alt="Logo">
                 <!-- Tagline if present -->
                 <div style="color:#cccccc; font-size:14px; margin-top:10px;">Making Agency Life Easier and More Profitable.</div>
              </td>
            </tr>

            <!-- MAIN CONTENT SECTION -->
            <tr>
              <td class="px-24" style="padding: 40px 30px;">
                <!-- INSERT BODY CONTENT HERE (Headings, Paragraphs, Images) -->
              </td>
            </tr>

            <!-- FOOTER SECTION (Always Black Background) -->
            <tr>
              <td class="bg-black p-24" style="background-color:#000000; padding:40px 30px; color:#ffffff;">
                 <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td class="stack" valign="top" width="50%" style="padding-bottom:20px;">
                         <!-- LEFT COL: Address / Logo -->
                         <img src="https://placehold.co/150x40/000000/ffffff?text=WL+IQ" width="100" style="display:block; margin-bottom:15px;" alt="Logo Small">
                         <p style="margin:0 0 5px 0; font-size:14px; color:#cccccc;">6853 N. Franklin Ave.<br>Loveland, CO 80538</p>
                         <p style="margin:0; font-size:14px;"><a href="mailto:info@whitelabeliq.com" class="footer-a">info@whitelabeliq.com</a></p>
                      </td>
                      <td class="stack" valign="top" width="50%" align="right" style="text-align:right;">
                         <!-- RIGHT COL: Phone / Sponsor -->
                         <p style="margin:0 0 5px 0; font-size:14px; color:#cccccc;">CALL US AT</p>
                         <p style="margin:0 0 20px 0; font-size:24px; font-weight:bold;">970.617.2292</p>
                         <p style="margin:0; font-size:12px; color:#999999;">Proud sponsor of the<br>Build A Better Agency podcast</p>
                      </td>
                    </tr>
                    <!-- Copyright / Links -->
                    <tr>
                       <td colspan="2" align="center" style="border-top:1px solid #333333; padding-top:20px; margin-top:20px; font-size:12px; color:#666666;">
                          <p style="margin:0 0 10px 0;">White Label IQ, Making Agency life Easier and More Profitable.</p>
                          <a href="#" class="footer-a">Privacy Policy</a>
                       </td>
                    </tr>
                 </table>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </tbody>
  </table>
</html>
\`\`\`

📝 TEXT EXTRACTION RULES:
- Extract strict text from the input screenshot.
- Populate the Header tagline, Body content, and Footer details from the screenshot.
- IF text matches the reference (address, phone), keep it exactly as is.

🎨 STYLING RULES:
- **Accent Color**: #ff6600 (Use for buttons/links in body).
- **Headings**: Fonts must be 24px+ for H1.
- **Body Text**: Minimum 16px.
- **Buttons / Accent Links**: 
  - MUST be 100% full-width (span the entire container).
  - Apply inline style: display:block; width:100%; text-align:center; background-color:#ff6600; color:#ffffff; padding:15px 0; text-decoration:none; border-radius:4px;
- **Body Images**:
  - If the screenshot contains images in the MAIN BODY (excluding Header/Footer logos), REPLACE them with: https://placehold.co/600x200
  - Ensure image style is: width:100%; height:auto; display:block;

📤 OUTPUT:
Return JSON: { "html": "..." }
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
