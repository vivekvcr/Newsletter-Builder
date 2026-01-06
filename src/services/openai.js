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
      body { background-color: #eee; font-family: 'Lato', sans-serif; margin: 0; padding: 0; }
      table { border-collapse: collapse; }
      .bg-black { background-color: #000000 !important; color: #ffffff !important; }
      .footer-a { color: #ffffff !important; text-decoration: none; }
      
      /* Mobile Responsive Styles */
      @media only screen and (max-width:620px) {
        /* Container adjustments */
        table[width="600"] { width: 100% !important; }
        
        /* Utility classes */
        .w-100 { width: 100% !important; }
        .stack { display: block !important; width: 100% !important; }
        .p-24 { padding: 24px !important; }
        .px-24 { padding-left: 24px !important; padding-right: 24px !important; }
        .center-m { text-align: center !important; }
        
        /* Heading adjustments for mobile */
        h1 { font-size: 28px !important; line-height: 34px !important; }
        h2 { font-size: 24px !important; line-height: 30px !important; }
        p { font-size: 16px !important; line-height: 1.5 !important; }
        
        /* Image scaling */
        img { max-width: 100% !important; height: auto !important; }
        
        /* Table stacking - force all columns to stack */
        table[width="50%"] { width: 100% !important; display: block !important; }
        td[width="50%"] { width: 100% !important; display: block !important; padding: 10px 0 !important; }
        td[width="60%"] { width: 100% !important; display: block !important; padding: 10px 0 !important; }
        td[width="40%"] { width: 100% !important; display: block !important; padding: 10px 0 !important; }
        
        /* Nested tables for icons */
        table[border="0"] { width: 100% !important; }
        
        /* Padding adjustments - reduce large padding on mobile */
        td[style*="padding:50px"] { padding: 24px !important; }
        td[style*="padding:40px"] { padding: 24px !important; }
        td[style*="padding:30px"] { padding: 20px !important; }
        td[style*="padding:4px 30px"] { padding: 4px 0 !important; }
        
        /* Button adjustments */
        a[style*="display:block"] { font-size: 16px !important; padding: 12px 0 !important; }
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

            <!-- FOOTER SECTION (Always Dark Background #1D1D1F) -->
            <tr>
              <td>
                <table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                  <tbody>
                    <tr>
                      <td>
                        <table class="row-content stack" bgcolor="#1D1D1F" align="center" border="0" cellpadding="0" cellspacing="0" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #ABABAB; background-color: #1D1D1F; width: 600px; margin-bottom: -1px;" width="600">
                          <tbody>
                            <tr>
                              <td class="column column-1 pad-25" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-left: 50px; padding-right: 50px; vertical-align: top; padding-top: 7px; padding-bottom: 5px;">
                                <table class="row-content stack" align="left" border="0" cellpadding="0" cellspacing="0" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 500px;" width="500">
                                  <tbody>
                                    <tr class="reverse">
                                      <!-- Logo Column -->
                                      <td class="column column-2 stack" width="60%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: middle; padding-top:30px; padding-bottom: 30px;">
                                        <table class="image_block block-2" width="100%" border="0" cellpadding="0" cellspacing="0" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                          <tbody>
                                            <tr>
                                              <td class="pad" style="padding:0;width:100%;">
                                                <div class="alignment" style="line-height:10px">
                                                  <a href="https://www.whitelabeliq.com/" target="_blank">
                                                    <img src="https://www.whitelabeliq.com/wp-content/themes/wliq/assets/images/newsletter/wliq-newsletter-footerlogo.png" style="display: block; height: auto; border: 0; width: 225px; max-width: 100%;" width="225" alt="White Label IQ">
                                                  </a>
                                                </div>
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>
                                      </td>
                                      <!-- Phone Column -->
                                      <td class="column column-1 stack" width="40%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding: 0; vertical-align: middle;">
                                        <table class="heading_block block-3" width="100%" border="0" cellpadding="0" cellspacing="0" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                          <tbody>
                                            <tr>
                                              <td class="pad" style="padding-bottom:10px;padding:0;text-align:center;width:100%;">
                                                <h3 style="margin: 0; color: #FFFFFF; font-family: Arial, Helvetica, sans-serif; font-size: 24px; font-weight: 400; line-height: 120%; text-align: left; width: 180px;">
                                                  <a href="tel:9706172292" style="color: #FFF; text-decoration: none;">
                                                    <span style="font-size: 16px;">CALL US AT</span><br>
                                                    <strong>970.617.2292</strong>
                                                  </a>
                                                </h3>
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                                
                                <!-- Contact Info Row -->
                                <table class="row-content stack" align="left" border="0" cellpadding="0" cellspacing="0" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 500px;" width="500">
                                  <tbody>
                                    <tr class="reverse">
                                      <!-- Address & Email Column -->
                                      <td class="column column-2 stack" width="60%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: middle; padding-top:10px; padding-bottom: 10px;">
                                        <table width="100%" border="0" cellpadding="0" cellspacing="0" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #ffffff; width: 100%;">
                                          <tbody>
                                            <!-- Address -->
                                            <tr>
                                              <td width="35" style="vertical-align: top;">
                                                <img src="https://www.whitelabeliq.com/wp-content/themes/wliq/assets/images/newsletter/newsletter-locationIcon.png" style="display: block; height: auto; border: 0; width: 16px; padding-top: 5px; max-width: 100%;" width="16" alt="Location">
                                              </td>
                                              <td style="vertical-align: middle;">
                                                <p style="margin: 0; margin-bottom: 10px;">
                                                  <a href="https://maps.app.goo.gl/6vRVBcFkhBY9BzG36" target="_blank" style="font-size: 16px; color:#ffffff; font-family: Arial, Helvetica, sans-serif; line-height:150%; text-decoration: none;">
                                                    6853 N. Franklin Ave.<br>Loveland, CO 80538
                                                  </a>
                                                </p>
                                              </td>
                                            </tr>
                                            <!-- Email -->
                                            <tr>
                                              <td width="35" style="vertical-align: middle;">
                                                <img src="https://www.whitelabeliq.com/wp-content/themes/wliq/assets/images/newsletter/newsletter-mailIcon.png" style="display: block; height: auto; border: 0; width: 21px; max-width: 100%;" width="21" alt="Email">
                                              </td>
                                              <td style="vertical-align: middle;">
                                                <p style="margin: 0;">
                                                  <a href="mailto:info@whitelabeliq.com" target="_blank" style="color: #ffffff; text-decoration: none; font-size: 16px;">info@whitelabeliq.com</a>
                                                </p>
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>
                                      </td>
                                      <!-- Sponsor Column -->
                                      <td class="column column-1 stack" width="40%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding: 0; vertical-align: bottom;">
                                        <table class="heading_block block-3" width="100%" border="0" cellpadding="0" cellspacing="0" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                          <tbody>
                                            <tr>
                                              <td class="pad" style="padding-bottom:10px;padding:0;text-align:center;width:100%;">
                                                <p style="margin: 0; color:#ffffff; font-family: Arial, Helvetica, sans-serif; line-height:150%; text-align:left; font-size:16px;">
                                                  Proud sponsor of the<br>Build a Better Agency podcast
                                                </p>
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  </tbody>
                </table>
                
                <!-- Divider -->
                <table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                  <tbody>
                    <tr>
                      <td>
                        <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #ffffff; background-color: #1D1D1F; width: 600px;" width="600">
                          <tbody>
                            <tr>
                              <td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 5px; padding-bottom: 5px;">
                                <table class="divider_block block-1" width="100%" border="0" cellpadding="5" cellspacing="0" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                  <tbody>
                                    <tr>
                                      <td class="pad pad-25" style="padding-left: 50px; padding-right: 50px;">
                                        <div class="alignment">
                                          <table border="0" cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                            <tbody>
                                              <tr>
                                                <td class="divider_inner" style="font-size: 1px; line-height: 1px; border-top: 2px solid #29292a;"></td>
                                              </tr>
                                            </tbody>
                                          </table>
                                        </div>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  </tbody>
                </table>
                
                <!-- Copyright & Privacy -->
                <table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                  <tbody>
                    <tr>
                      <td>
                        <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #ffffff; background-color: #1D1D1F; width: 600px; margin-top: -1px;" width="600">
                          <tbody>
                            <tr>
                              <td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 5px; padding-bottom: 5px;">
                                <table class="paragraph_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                                  <tbody>
                                    <tr>
                                      <td class="pad pad-25" style="padding-bottom:15px;padding-left:50px;padding-right:50px;padding-top:10px;">
                                        <div class="text-center" style="color:#ffffff; font-family: Arial, Helvetica, sans-serif; line-height:150%; text-align:center;">
                                          <p style="margin: 0; margin-bottom: 10px; font-size:16px;">
                                            <a style="color:#ffffff; text-decoration: none;" href="https://www.whitelabeliq.com/" target="_blank">White Label IQ</a>, Making Agency Life Easier and More Profitable.
                                          </p>
                                          <p style="margin: 0; font-size:16px;">
                                            <a href="https://www.whitelabeliq.com/privacy-policy/" target="_blank" style="color: #ffffff; text-decoration: none;">Privacy Policy</a>
                                          </p>
                                        </div>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  </tbody>
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

📱 MOBILE RESPONSIVENESS REQUIREMENTS:
- ALWAYS add class="stack" to columns that should stack on mobile (50%, 60%, 40% width columns)
- ALWAYS add class="px-24" to content cells that need mobile padding
- ALWAYS add class="p-24" to sections that need full mobile padding
- Ensure all tables with width="600" are responsive
- Two-column layouts MUST stack vertically on mobile

🎨 STYLING RULES:
- **Accent Color**: #ff6600 (Use for buttons/links in body).
- **Headings**: 
  - **H1**: font-size:44px; line-height:50px;
  - **H2**: font-size:34px; line-height:40px;
- **Body Text**: Minimum 16px.
- **Background Colors** (Use these standard backgrounds):
  - **Light Gray**: #E7E8EB (for subtle sections)
  - **Black**: #000000 (for dark sections, footer)
  - **White**: #ffffff (for main content areas)
- **Buttons / Accent Links**: 
  - MUST be 100% full-width (span the entire container).
  - Apply inline style: display:block; width:100%; text-align:center; background-color:#ff6600; color:#ffffff; padding:10px 0; text-decoration:none; border-radius:4px; line-height:40px;
- **Body Images**:
  - If the screenshot contains images in the MAIN BODY (excluding Header/Footer logos), REPLACE them with: https://placehold.co/600x200
  - Ensure image style is: width:100%; height:auto; display:block;

� **SECTION SPACING RULES**:
- Each major section MUST be in a separate \`< tr >\` element
- Add vertical spacing between sections by inserting this EXACT code:
- Use spacing rows between:
  - Header and first content section
  - Between different content sections
  - Before footer section
- Do NOT add spacing inside a single content block

�📋 **SPECIAL PATTERN: Two-Column Icon List**
If the screenshot shows a section with:
- A heading
- Descriptive text
- Two columns of items with icons/images on the left
- Optional CTA button at bottom

Use this exact structure:
    < tr >
    <td style="padding:50px 50px;background:#ffffff;" bgcolor="#000000" class="dark-bg">
      <h2 style="margin:0 0 20px;font:600 44px/28px Arial,Helvetica,sans-serif;color:#000;line-height: 50px;font-weight: 600;" class="dark-text">
        [HEADING TEXT FROM SCREENSHOT]
      </h2>
      <p style="margin:0 0 20px;font:20px/24px Arial,Helvetica,sans-serif;color:#000000;line-height: 1.5;" class="dark-muted">
        [DESCRIPTION TEXT FROM SCREENSHOT]
      </p>
      <p style="margin:0 0 20px;font:20px/24px Arial,Helvetica,sans-serif;color:#000000;line-height: 1.5;" class="dark-muted">
        [OPTIONAL SECOND PARAGRAPH]
      </p>
      <table width="100%" border="0" cellspacing="0" cellpadding="0">
        <tbody>
          <tr>
            <!-- LEFT COLUMN -->
            <td class="stack" style="padding:4px 30px 4px 0;" width="50%" valign="top">
              <!-- REPEAT FOR EACH LEFT COLUMN ITEM -->
              <table border="0" cellspacing="0" cellpadding="0">
                <tbody>
                  <tr style="margin-bottom: 15px;display: block;">
                    <td style="color:#ff6a21;font-size:16px;line-height:22px;padding-right:12px;vertical-align: top;">
                      <img height="auto" width="50" alt="Icon" src="[ICON URL OR https://placehold.co/50x50]">
                    </td>
                    <td style="font:20px/16px Arial,Helvetica,sans-serif;color:#000;line-height: 26px;font-weight: 500;opacity: 0.8;">
                      [ITEM TEXT]
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>

            <!-- RIGHT COLUMN -->
            <td class="stack" style="padding:4px 30px 4px 12px;" width="50%" valign="top">
              <!-- REPEAT FOR EACH RIGHT COLUMN ITEM -->
              <table border="0" cellspacing="0" cellpadding="0">
                <tbody>
                  <tr style="margin-bottom: 15px;display: block;">
                    <td style="color:#ff6a21;font-size:16px;line-height:22px;padding-right:12px;vertical-align: top;">
                      <img height="auto" width="50" alt="Icon" src="[ICON URL OR https://placehold.co/50x50]">
                    </td>
                    <td style="font:20px/16px Arial,Helvetica,sans-serif;color:#000;line-height: 26px;font-weight: 500;opacity: 0.8;">
                      [ITEM TEXT]
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- OPTIONAL CTA BUTTON -->
      <table style="margin-top:40px;width: 100%;" align="left" border="0" cellspacing="0" cellpadding="0">
        <tbody>
          <tr>
            <td class="" style="padding:0px;" width="100%">
              <a href="#" style="display:block;width:100%;text-align:center;background-color:#ff6600;color:#ffffff;padding: 10px 0;text-decoration:none;border-radius:4px;line-height: 30px;font-size: 18px;">WATCH THIS WEBINAR</a>
            </td>
          </tr>
        </tbody>
      </table>
    </td>
</tr >
\`\`\`

� **SPECIAL PATTERN: Dark Background Section with Bullet List**
If the screenshot shows a section with:
- Dark/black background
- White text heading
- Description paragraphs
- Bullet point list
- Optional bold text highlights

Use this exact structure:
\`\`\`html
<tr>
  <td class="dark-bg" bgcolor="#000000" style="padding:50px 50px;background:#000000;">
    <table cellpadding="0" cellspacing="0" border="0" width="100%">
      <tbody>
        <tr>
          <td valign="top" width="60%" style="padding:4px 30px 4px 0;">
            <h2 class="dark-text" style="margin:0 0 0;font:700 34px/28px Arial,Helvetica,sans-serif;color:#ffffff;line-height: 40px;font-weight: 700;">
              [HEADING TEXT FROM SCREENSHOT]
            </h2>
          </td>
        </tr>
      </tbody>
    </table>
    <table cellpadding="0" cellspacing="0" border="0" align="left" style="margin-top:20px;">
      <tbody>
        <tr>
          <td>
            <p class="dark-muted" style="margin:0 0 0;font:500 20px/24px Arial,Helvetica,sans-serif;color:#FFFFFF;line-height: 1.3;">
              [SUBHEADING OR INTRO TEXT]
            </p>
          </td>
        </tr>
        <tr>
          <td>
            <p class="dark-muted" style="padding-top:10px;font:500 20px/24px Arial,Helvetica,sans-serif;color:#FFFFFF;line-height: 1.3;">
              [DESCRIPTION PARAGRAPH]
            </p>
            <p class="dark-muted" style="padding-top:10px;font:500 20px/24px Arial,Helvetica,sans-serif;color:#FFFFFF;line-height: 1.3;">
              [OPTIONAL SECOND PARAGRAPH OR LIST INTRO]
            </p>
            <ul class="dark-muted" style="margin:20 0 0;font:500 20px/24px Arial,Helvetica,sans-serif;color:#FFFFFF;line-height: 1.3;">
              <li>[BULLET POINT 1]</li>
              <li>[BULLET POINT 2]</li>
              <li>[BULLET POINT 3]</li>
              <li>[BULLET POINT 4]</li>
            </ul>
            <p class="dark-muted" style="margin:20 0 0;font:500 20px/24px Arial,Helvetica,sans-serif;color:#FFFFFF;line-height: 1.3;">
              [CLOSING PARAGRAPH - Use <strong> for bold text]
            </p>
            <p style="margin:22px 0 0 0;font:20px/24px Arial,Helvetica,sans-serif;color:#FFFFFF;font-weight: 500;line-height: 1.5;">
              [OPTIONAL FINAL STATEMENT]<br>
              [OPTIONAL SECOND LINE]
            </p>
          </td>
        </tr>
      </tbody>
    </table>
  </td>
</tr>
\`\`\`

📋 **SPECIAL PATTERN: Full-Width Quote/Image Section**
If the screenshot shows:
- A standalone quote or text image
- Full-width display
- White/light background
- Often has a colored left border or accent

Use this exact structure:
\`\`\`html
<tr style="background: #fff;">
  <td style="padding:50px 50px 50px 50px;">
    <img src="[IMAGE URL OR https://placehold.co/600x200/f5f5f5/333333?text=Quote+Text]" 
         width="600" 
         height="auto" 
         alt="[QUOTE TEXT OR DESCRIPTION]" 
         style="border-radius:0;display:block;width: 100%;">
  </td>
</tr>
\`\`\`

Note: If the quote text is readable in the screenshot, you can either:
1. Use the actual image URL if visible
2. Create a placeholder with the quote text
3. Replace with a text-based quote block if preferred.

�📤 OUTPUT:
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
