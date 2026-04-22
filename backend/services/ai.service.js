const { OpenAI } = require('openai');

class AIService {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async generateSummary(content) {
    const prompt = `Summarize this blog in 2-3 concise lines:\n\n${content}`;
    const response = await this.openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 150,
      temperature: 0.7,
    });
    return response.choices[0].message.content.trim();
  }

  async generateTitles(content) {
    const prompt = `Generate 3 engaging blog titles for this content. Only return the exact 3 titles separated by a new line, no numbering:\n\n${content}`;
    const response = await this.openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 100,
      temperature: 0.8,
    });
    const resultText = response.choices[0].message.content.trim();
    return resultText.split('\n').map(t => t.replace(/^[-*•\d.\s]+/, '').replace(/^['"]|['"]$/g, '').trim()).filter(t => t);
  }

  async suggestCategory(content) {
    const prompt = `Suggest the most relevant category (Technology, Travel, Education, Food, Lifestyle, Health, Business) for this blog. Choose from this list or provide a 1-word new category, output ONLY the word:\n\n${content}`;
    const response = await this.openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 20,
      temperature: 0.5,
    });
    return response.choices[0].message.content.trim();
  }
}

module.exports = new AIService();