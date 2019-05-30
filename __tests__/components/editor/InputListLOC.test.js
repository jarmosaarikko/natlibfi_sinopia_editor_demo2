// Copyright 2018, 2019 Stanford University see LICENSE for license

import React from 'react'
import { shallow } from 'enzyme'
import { Typeahead } from 'react-bootstrap-typeahead'
import InputList from '../../../src/components/editor/InputListLOC'

const plProps = {
  "propertyTemplate":
    {
      "propertyURI": "http://id.loc.gov/ontologies/bflc/target",
      "propertyLabel": "Frequency (RDA 2.14)",
      "remark": "http://access.rdatoolkit.org/2.14.html",
      "mandatory": "false",
      "repeatable": "false",
      "type": "lookup",
      "valueConstraint": {
        "repeatable": "true",
        "defaults": [{
          "defaultURI": "http://id.loc.gov/vocabulary/carriers/nc",
          "defaultLiteral": "volume"
        }],
        "valueTemplateRefs": [],
        "useValuesFrom": [
          "vocabulary:bf2:frequencies"
        ],
        "valueDataType": {
          "dataTypeURI": "http://id.loc.gov/ontologies/bibframe/Frequency"
        }
      }
    }
}

describe('<InputList />', () => {
  // our mock formData function to replace the one provided by mapDispatchToProps
  const mockFormDataFn = jest.fn()
  const wrapper = shallow(<InputList.WrappedComponent {...plProps} handleSelectedChange={mockFormDataFn} />)

  it('contains a placeholder with the value of propertyLabel', () => {
    expect(wrapper.find(Typeahead).props().placeholder).toMatch("Frequency (RDA 2.14)")
  })

  it('typeahead component should have a placeholder attribute with value propertyLabel', () => {
    expect(wrapper.find('#targetComponent').props().placeholder).toBe('Frequency (RDA 2.14)')
  })

  it('sets the typeahead component required attribute according to the mandatory value from the template', () => {
    expect(wrapper.find('#targetComponent').props().required).toBe(false)
  })

  it('displays RequiredSuperscript if mandatory from template is true', () => {
    wrapper.instance().props.propertyTemplate.mandatory = "true"
    wrapper.instance().forceUpdate()
    expect(wrapper.find('label > RequiredSuperscript')).toBeTruthy()
  })

  it('displays a text label if remark from template is absent', () => {
    wrapper.instance().props.propertyTemplate.remark = undefined
    wrapper.instance().forceUpdate()
    expect(wrapper.find(Typeahead).props().placeholder).toMatch("Frequency (RDA 2.14)")
  })

  it('sets the typeahead component multiple attribute according to the repeatable value from valueContraints in the property template', () => {
    expect(wrapper.find('#targetComponent').props().multiple).toBe(true)
  })

  it('sets the typeahead component placeholder attribute', () => {
    expect(wrapper.find('#targetComponent').props().placeholder).toMatch('Frequency (RDA 2.14)')
  })

  describe('default values', () => {
    afterAll(() => {
      jest.restoreAllMocks()
    })

    it('sets the default values according to the property template if they exist', () => {
      const defaults = [{
        id: 'http://id.loc.gov/vocabulary/carriers/nc',
        uri: 'http://id.loc.gov/vocabulary/carriers/nc',
        label: 'volume'
      }]
      expect(wrapper.state('defaults')).toEqual(defaults)
    })

    it('logs an error when no defaults are set', () => {
      const plProps = {
        "propertyTemplate": {
          "propertyURI": "http://id.loc.gov/ontologies/bflc/target",
          "propertyLabel": "Frequency (RDA 2.14)",
          "remark": "http://access.rdatoolkit.org/2.14.html",
          "mandatory": "false",
          "repeatable": "false",
          "type": "lookup",
          "valueConstraint": {
            "repeatable": "true",
            "valueTemplateRefs": [],
            "useValuesFrom": [
              "vocabulary:bf2:frequencies"
            ],
            "valueDataType": {
              "dataTypeURI": "http://id.loc.gov/ontologies/bibframe/Frequency"
            }
          }
        }
      }
      const infoSpy = jest.spyOn(console, 'info').mockReturnValue(null)
      const wrapper2 = shallow(<InputList.WrappedComponent {...plProps} handleSelectedChange={mockFormDataFn} />)

      expect(wrapper2.state('defaults')).toEqual([])
      expect(infoSpy).toBeCalledWith(`no defaults defined in property template: ${JSON.stringify(plProps.propertyTemplate)}`)
    })
  })

  it('should call the onFocus event and set the selected option', () => {
    const opts = {id: 'URI', label: 'LABEL', uri: 'URI'}
    wrapper.instance().opts = opts
    const event = (wrap) => {
      global.fetch = jest.fn().mockImplementation(async () => await ({ok: true, resp: wrapper.instance().opts }))
      wrap.setState({options: [ wrapper.instance().opts ]})
      wrap.setState({selected: [ wrapper.instance().opts ]})
    }
    wrapper.find('#targetComponent').simulate('focus', event(wrapper))
    expect(wrapper.state().options[0]).toEqual(opts)

    wrapper.find('#targetComponent').simulate('change', event(wrapper))
    expect(wrapper.state().selected[0]).toEqual(opts)
  })

  it('sets the formData store with the total number or objects sent to "selected" when a change event happens', () => {
    expect(mockFormDataFn.mock.calls.length).toBe(2)
  })
})
