// Copyright 2019 Stanford University see LICENSE for license

import pupExpect from 'expect-puppeteer'
import { testUserLogin } from './loginHelper'

describe('Adding new embedded Resource Templates', () => {
  beforeAll(async () => {
    await testUserLogin()
    await pupExpect(page).toClick('a', { text: 'BIBFRAME Instance' })
    return await pupExpect(page).toMatch('BIBFRAME Instance')
  })

  describe('one level of nested resourceTemplate (Notes about the Instance)', () => {
    it('clicking AddButton adds second resource template', async () => {
      const panelBodySel = 'div[propLabel="Notes about the Instance"] > div.panel-body'
      let noteRtOutlines = await page.$$(`${panelBodySel} .rtOutline`)

      expect(noteRtOutlines.length).toEqual(1)
      await pupExpect(page).toClick(`${panelBodySel} button`) // Add button
      noteRtOutlines = await page.$$(`${panelBodySel} .rtOutline`)
      expect(noteRtOutlines.length).toEqual(2)
    })
  })

  describe('two levels of nested resourceTemplates (Instance of -> Notes about the Work)', () => {
    it('clicking AddButton adds second resource template', async () => {
      const ptOutlineSel = 'div[propLabel="Instance of"] div.rtOutline[propLabel="Notes about the Work"]'

      await pupExpect(page).toClick(`${ptOutlineSel} a[data-id='note']`)
      let noteRtOutlines = await page.$$(`${ptOutlineSel} .rtOutline`)

      expect(noteRtOutlines.length).toEqual(1)
      await pupExpect(page).toClick(`${ptOutlineSel} button`) // Add button
      noteRtOutlines = await page.$$(`${ptOutlineSel} .rtOutline`)
      expect(noteRtOutlines.length).toEqual(2)
    })
  })

  it('AddButton disabled for non-repeatable resourceTemplate (Item Information -> Barcode)', async () => {
    await pupExpect(page).toMatchElement('div[propLabel="Item Information"] > div.panel-body button', { disabled: true })
  })
})
