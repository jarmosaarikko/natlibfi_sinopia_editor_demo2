// Copyright 2018 Stanford University see LICENSE for license
import React from 'react'
import { shallow } from 'enzyme'
import InputLang from 'components/editor/property/InputLang'

const plProps = {
  propertyTemplate:
    {
      propertyLabel: 'Instance of',
      propertyURI: 'http://id.loc.gov/ontologies/bibframe/instanceOf',
      type: 'literal',
    },
  textValue: 'test1',
}

describe('<InputLang />', () => {
  // our mock formData function to replace the one provided by mapDispatchToProps
  const mockFormDataFn = jest.fn()
  const wrapper = shallow(<InputLang.WrappedComponent {...plProps} handleSelectedChange={mockFormDataFn} />)

  it('contains a label with the value of propertyLabel', () => {
    const expected = 'Select language for test1'

    expect(wrapper.find('label').text()).toEqual(
      expect.stringContaining(expected),
    )
  })

  it('typeahead component should useCache attribute', () => {
    expect(wrapper.find('#langComponent').props().useCache).toBeTruthy()
  })

  it('typeahead component should use selectHintOnEnter', () => {
    expect(wrapper.find('#langComponent').props().selectHintOnEnter).toBeTruthy()
  })

  it('should call the onChange event and set the state with the selected option', () => {
    const event = (wrap) => {
      wrap.setState({ options: ['{id: \'test1\', uri: \'URI\', label: \'LABEL\'}'] })
    }

    wrapper.find('#langComponent').simulate('change', event(wrapper))
    expect(wrapper.state().options[0]).toBe('{id: \'test1\', uri: \'URI\', label: \'LABEL\'}')
  })

  it('should call the onFocus event and set the selected option', () => {
    const opts = { id: 'URI', label: 'LABEL', uri: 'URI' }

    wrapper.instance().opts = opts
    const event = (wrap) => {
      global.fetch = jest.fn().mockImplementation(async () => await { ok: true, resp: wrapper.instance().opts })
      wrap.setState({ options: [wrapper.instance().opts] })
      wrap.setState({ selected: [wrapper.instance().opts] })
    }

    wrapper.find('#langComponent').simulate('focus', event(wrapper))
    expect(wrapper.state().options[0]).toEqual(opts)

    wrapper.find('#langComponent').simulate('change', event(wrapper))
    expect(wrapper.state().selected[0]).toEqual(opts)

    wrapper.find('#langComponent').simulate('blur', event(wrapper))
    expect(wrapper.state('isLoading')).toBeFalsy()
  })

  it('sets the formData store with the total number of objects sent to selected', () => {
    expect(mockFormDataFn.mock.calls.length).toBe(2)
  })

  it('creates a hash of options that it renders in the form field', () => {
    const lcLanguage = [
      {
        '@id': 'http://id.loc.gov/vocabulary/languages/sna',
        'http://www.loc.gov/mads/rdf/v1#authoritativeLabel': [
          {
            '@language': 'en',
            '@value': 'Shona',
          },
        ],
      },
    ]
    const options = wrapper.instance().createOptions(lcLanguage)

    expect(options).toEqual({ id: 'http://id.loc.gov/vocabulary/languages/sna', uri: 'http://id.loc.gov/vocabulary/languages/sna', label: 'Shona' })
  })
})