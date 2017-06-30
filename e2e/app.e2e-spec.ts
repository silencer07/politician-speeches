import { PoliticianSpeechesPage } from './app.po';

describe('politician-speeches App', () => {
  let page: PoliticianSpeechesPage;

  beforeEach(() => {
    page = new PoliticianSpeechesPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
