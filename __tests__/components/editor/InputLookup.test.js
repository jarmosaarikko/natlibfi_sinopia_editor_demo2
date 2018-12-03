// Copyright 2018 Stanford University see Apache2.txt for license
import React from 'react'
import { shallow } from 'enzyme'
import InputLookup from '../../../src/components/editor/InputLookup'

const plProps = {
  "propertyTemplate":
    {
      "mandatory": "false",
      "repeatable": "true",
      "type": "lookup",
      "resourceTemplates": [],
      "valueConstraint": {
        "valueTemplateRefs": [],
        "useValuesFrom": [
          'lookupQaLocNames'
        ],
        "valueDataType": {
          "dataTypeURI": "http://id.loc.gov/ontologies/bibframe/Agent"
        },
        "defaults": []
      },
      "propertyURI": "http://id.loc.gov/ontologies/bflc/target",
      "propertyLabel": "Name Lookup"
    }
}

describe('<InputLookup />', () => {
  const wrapper = shallow(<InputLookup {...plProps} />)

  it('uses the propertyLabel from the template as the form control label', () => {
    expect(wrapper.find('label').text()).toMatch('Name Lookup')
  })

  it('sets the typeahead component required attribute according to the mandatory property from the template', () => {
    expect(wrapper.find('#lookupComponent').props().required).toBeFalsy()
  })

  it('sets the typeahead component multiple attribute according to the repeatable property from the template', () => {
    expect(wrapper.find('#lookupComponent').props().multiple).toBeTruthy()
  })

  it('sets the typeahead component placeholder attribute to be the propertyLabel', () => {
    expect(wrapper.find('#lookupComponent').props().placeholder).toBe('Name Lookup')
  })

  it('should call onChange prop', () => {
    const event = (wrap) => {
      wrap.setState({options: ["{uri: 'URI', label: 'LABEL'}"]})
    }
    wrapper.find('#lookupComponent').simulate('change', event(wrapper))
    expect(wrapper.state().options[0]).toBe("{uri: 'URI', label: 'LABEL'}")
  });
})
