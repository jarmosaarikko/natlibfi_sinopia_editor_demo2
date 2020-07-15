// Copyright 2019 Stanford University see LICENSE for licenseimport React from 'react'
import { initialState } from 'store'
import _ from 'lodash'

export const createState = (options = {}) => {
  const state = _.cloneDeep(initialState)
  buildAuthenticate(state, options)
  buildLanguages(state, options)
  buildResourceWithLiteral(state, options)
  buildResourceWithNestedResource(state, options)

  return state
}

const buildAuthenticate = (state, options) => {
  state.authenticate = { authenticationState: {} }

  if (options.notAuthenticated) return

  state.authenticate.authenticationState = {
    currentSession: {
      idToken: {},
    },
    currentUser: {
      username: 'Foo McBar',
    },
  }
}

const buildLanguages = (state, options) => {
  if (options.noLanguage) return

  state.selectorReducer.entities.languages.options = [
    { id: 'tai', label: 'Tai languages' },
    { id: 'eng', label: 'English' },
  ]
}

const buildResourceWithLiteral = (state, options) => {
  if (!options.hasResourceWithLiteral) return

  state.selectorReducer.editor.currentResource = 't9zVwg2zO'
  state.selectorReducer.entities.subjectTemplates = {
    'ld4p:RT:bf2:Title:AbbrTitle': {
      key: 'ld4p:RT:bf2:Title:AbbrTitle',
      id: 'ld4p:RT:bf2:Title:AbbrTitle',
      class: 'http://id.loc.gov/ontologies/bibframe/AbbreviatedTitle',
      label: 'Abbreviated Title',
      author: 'LD4P',
      date: '2019-08-19',
      propertyTemplateKeys: [
        'ld4p:RT:bf2:Title:AbbrTitle > http://id.loc.gov/ontologies/bibframe/mainTitle',
      ],
    },
  }
  state.selectorReducer.entities.propertyTemplates = {
    'ld4p:RT:bf2:Title:AbbrTitle > http://id.loc.gov/ontologies/bibframe/mainTitle': {
      key: 'ld4p:RT:bf2:Title:AbbrTitle > http://id.loc.gov/ontologies/bibframe/mainTitle',
      subjectTemplateKey: 'ld4p:RT:bf2:Title:AbbrTitle',
      label: 'Abbreviated Title',
      uri: 'http://id.loc.gov/ontologies/bibframe/mainTitle',
      required: false,
      repeatable: false,
      defaults: [],
      remarkUrl: null,
      type: 'literal',
      component: 'InputLiteral',
      authorities: [],
    },
  }
  state.selectorReducer.entities.subjects = {
    t9zVwg2zO: {
      key: 't9zVwg2zO',
      uri: 'https://trellis.sinopia.io/repository/washington/0894a8b3',
      subjectTemplateKey: 'ld4p:RT:bf2:Title:AbbrTitle',
      propertyKeys: [
        'JQEtq-vmq8',
      ],
    },
  }
  state.selectorReducer.entities.properties = {
    'JQEtq-vmq8': {
      key: 'JQEtq-vmq8',
      subjectKey: 't9zVwg2zO',
      propertyTemplateKey: 'ld4p:RT:bf2:Title:AbbrTitle > http://id.loc.gov/ontologies/bibframe/mainTitle',
      valueKeys: [
        'CxGx7WMh2',
      ],
      show: true,
      errors: [],
    },
  }
  state.selectorReducer.entities.values = {
    CxGx7WMh2: {
      key: 'CxGx7WMh2',
      propertyKey: 'JQEtq-vmq8',
      literal: 'foo',
      lang: 'eng',
      uri: null,
      label: null,
      valueSubjectKey: null,
    },
  }
}

const buildResourceWithNestedResource = (state, options) => {
  if (!options.hasResourceWithNestedResource) return

  state.selectorReducer.editor.currentResource = 'ljAblGiBW'
  state.selectorReducer.entities.subjectTemplates = {
    'resourceTemplate:testing:uber1': {
      key: 'resourceTemplate:testing:uber1',
      id: 'resourceTemplate:testing:uber1',
      class: 'http://id.loc.gov/ontologies/bibframe/Uber1',
      label: 'Uber template1',
      remark: 'Template for testing purposes.',
      propertyTemplateKeys: [
        'resourceTemplate:testing:uber1 > http://id.loc.gov/ontologies/bibframe/uber/template1/property1',
      ],
    },
    'resourceTemplate:testing:uber2': {
      key: 'resourceTemplate:testing:uber2',
      id: 'resourceTemplate:testing:uber2',
      class: 'http://id.loc.gov/ontologies/bibframe/Uber2',
      label: 'Uber template2',
      remark: 'Template for testing purposes with single repeatable literal.',
      propertyTemplateKeys: [
        'resourceTemplate:testing:uber2 > http://id.loc.gov/ontologies/bibframe/uber/template2/property1',
      ],
    },
  }
  state.selectorReducer.entities.propertyTemplates = {
    'resourceTemplate:testing:uber1 > http://id.loc.gov/ontologies/bibframe/uber/template1/property1': {
      key: 'resourceTemplate:testing:uber1 > http://id.loc.gov/ontologies/bibframe/uber/template1/property1',
      subjectTemplateKey: 'resourceTemplate:testing:uber1',
      label: 'Uber template1, property1',
      uri: 'http://id.loc.gov/ontologies/bibframe/uber/template1/property1',
      required: false,
      repeatable: true,
      defaults: [],
      remark: 'Nested, repeatable resource template.',
      remarkUrl: null,
      type: 'resource',
      component: 'InputURI',
      valueSubjectTemplateKeys: [
        'resourceTemplate:testing:uber2',
      ],
      authorities: [],
    },
    'resourceTemplate:testing:uber2 > http://id.loc.gov/ontologies/bibframe/uber/template2/property1': {
      key: 'resourceTemplate:testing:uber2 > http://id.loc.gov/ontologies/bibframe/uber/template2/property1',
      subjectTemplateKey: 'resourceTemplate:testing:uber2',
      label: 'Uber template2, property1',
      uri: 'http://id.loc.gov/ontologies/bibframe/uber/template2/property1',
      required: false,
      repeatable: true,
      defaults: [],
      remark: 'A repeatable literal',
      remarkUrl: null,
      type: 'literal',
      component: 'InputLiteral',
      authorities: [],
    },
  }
  state.selectorReducer.entities.subjects = {
    ljAblGiBW: {
      key: 'ljAblGiBW',
      uri: null,
      subjectTemplateKey: 'resourceTemplate:testing:uber1',
      propertyKeys: [
        'v1o90QO1Qx',
      ],
      subjectTemplate: {
        key: 'resourceTemplate:testing:uber1',
        id: 'resourceTemplate:testing:uber1',
        class: 'http://id.loc.gov/ontologies/bibframe/Uber1',
        label: 'Uber template1',
        remark: 'Template for testing purposes.',
        propertyTemplateKeys: [
          'resourceTemplate:testing:uber1 > http://id.loc.gov/ontologies/bibframe/uber/template1/property1',
        ],
      },
    },
    XPb8jaPWo: {
      key: 'XPb8jaPWo',
      uri: null,
      subjectTemplateKey: 'resourceTemplate:testing:uber2',
      propertyKeys: [
        '7caLbfwwle',
      ],
      subjectTemplate: {
        key: 'resourceTemplate:testing:uber2',
        id: 'resourceTemplate:testing:uber2',
        class: 'http://id.loc.gov/ontologies/bibframe/Uber2',
        label: 'Uber template2',
        remark: 'Template for testing purposes with single repeatable literal.',
        propertyTemplateKeys: [
          'resourceTemplate:testing:uber2 > http://id.loc.gov/ontologies/bibframe/uber/template2/property1',
        ],
      },
    },
  }
  state.selectorReducer.entities.properties = {
    v1o90QO1Qx: {
      key: 'v1o90QO1Qx',
      subjectKey: 'ljAblGiBW',
      propertyTemplateKey: 'resourceTemplate:testing:uber1 > http://id.loc.gov/ontologies/bibframe/uber/template1/property1',
      valueKeys: [
        'VDOeQCnFA8',
      ],
      show: true,
      errors: [],
    },
    '7caLbfwwle': {
      key: '7caLbfwwle',
      subjectKey: 'XPb8jaPWo',
      propertyTemplateKey: 'resourceTemplate:testing:uber2 > http://id.loc.gov/ontologies/bibframe/uber/template2/property1',
      valueKeys: [
        'pRJ0lO_mT-',
      ],
      show: true,
      errors: [],
    },
  }
  state.selectorReducer.entities.values = {
    VDOeQCnFA8: {
      key: 'VDOeQCnFA8',
      propertyKey: 'v1o90QO1Qx',
      literal: null,
      lang: null,
      uri: null,
      label: null,
      valueSubjectKey: 'XPb8jaPWo',
    },
    'pRJ0lO_mT-': {
      key: 'pRJ0lO_mT-',
      propertyKey: '7caLbfwwle',
      literal: 'foo',
      lang: 'eng',
      uri: null,
      label: null,
      valueSubjectKey: null,
    },
  }
}


export const noop = () => {}