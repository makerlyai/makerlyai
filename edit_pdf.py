import fitz

doc = fitz.open(r'C:\Users\windows\Desktop\Makerly_AI_Portfolio_and_Rates.pdf')
for page in doc:
    for text, repl in [('$1,000', 'INR 25,000'), ('$3,500', 'INR 50,000')]:
        rects = page.search_for(text)
        for rect in rects:
            page.add_redact_annot(rect)
            page.apply_redactions()
            # If the PDF is dark themed, text should probably be white (1,1,1) or dark gray(0.8,0.8,0.8)
            # If the PDF is light themed, text should be black (0,0,0)
            # Let's try white since Makerly is usually dark theme
            page.insert_text((rect.x0, rect.y1 - 2), repl, fontsize=14, color=(1, 1, 1), fontname='helv')
        
doc.save(r'C:\Users\windows\Desktop\Makerly_AI_Portfolio_and_Rates_INR.pdf')
print('PDF Modified Successfully!')
