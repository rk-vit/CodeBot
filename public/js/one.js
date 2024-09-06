function separateCodeAndText(response) {
    const codeRegex = /'''(.*?)'''/s;
    const codeMatch = response.match(codeRegex);
    const code = codeMatch ? codeMatch[1].trim() : "No code found.";
    const text = response.replace(codeRegex, '').trim();
    return { code, text };
}