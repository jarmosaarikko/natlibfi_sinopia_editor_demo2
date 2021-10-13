// Copyright 2019 Stanford University see LICENSE for license

import React from "react"
import { useSelector } from "react-redux"
import PropTypes from "prop-types"
import Header from "../Header"
import SinopiaSearchResults from "./SinopiaSearchResults"
import QASearchResults from "./QASearchResults"
import SearchResultsPaging from "./SearchResultsPaging"
import SearchResultsMessage from "./SearchResultsMessage"
import Alert from "../Alert"
import {
  selectSearchError,
  selectSearchQuery,
  selectSearchUri,
  selectSearchOptions,
  selectSearchTotalResults,
} from "selectors/search"
import { sinopiaSearchUri } from "utilities/authorityConfig"
import useSearch from "hooks/useSearch"

const Search = (props) => {
  const { fetchSearchResults } = useSearch()

  const searchOptions = useSelector((state) =>
    selectSearchOptions(state, "resource")
  )
  const error = useSelector((state) => selectSearchError(state, "resource"))
  const uri = useSelector((state) => selectSearchUri(state, "resource"))
  const queryString = useSelector((state) =>
    selectSearchQuery(state, "resource")
  )
  const totalResults = useSelector((state) =>
    selectSearchTotalResults(state, "resource")
  )

  const changeSearchPage = (startOfRange) => {
    fetchSearchResults(queryString, uri, searchOptions, startOfRange)
  }

  return (
    <div id="search">
      <Header triggerEditorMenu={props.triggerHandleOffsetMenu} />
      <Alert
        text={error && `An error occurred while searching: ${error.toString()}`}
      />
      {uri === sinopiaSearchUri ? (
        <SinopiaSearchResults />
      ) : (
        <QASearchResults />
      )}
      <SearchResultsPaging
        resultsPerPage={searchOptions.resultsPerPage}
        startOfRange={searchOptions.startOfRange}
        totalResults={totalResults}
        changePage={changeSearchPage}
      />
      <SearchResultsMessage />
    </div>
  )
}

Search.propTypes = {
  triggerHandleOffsetMenu: PropTypes.func,
}

export default Search
