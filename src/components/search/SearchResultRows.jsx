// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import PropTypes from 'prop-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCopy, faEdit, faEye } from '@fortawesome/free-solid-svg-icons'
import LongDate from 'components/LongDate'
import usePermissions from 'hooks/usePermissions'

/**
 * Generates HTML rows of all search results
 */
const SearchResultRows = ({
  searchResults, handleEdit, handleCopy, handleView, groupMap,
}) => {
  const { canEdit, canCreate } = usePermissions()
  return searchResults.map((row) => (
    <tr key={row.uri}>
      <td>{ row.label }{ row.label !== row.uri && <React.Fragment><br />{ row.uri }</React.Fragment>}</td>
      <td>
        <ul className="list-unstyled">
          { row.type?.map((type) => <li key={type}>{type}</li>) }
        </ul>
      </td>
      <td>{ groupMap[row.group] }</td>
      <td><LongDate datetime={ row.modified } /></td>
      <td>
        <div className="btn-group" role="group" aria-label="Result Actions">
          <button className="btn btn-link"
                  title="View"
                  aria-label={`View ${row.label}`}
                  data-testid={`View ${row.label}`}
                  onClick={() => handleView(row.uri) }>
            <FontAwesomeIcon icon={faEye} className="icon-lg" />
          </button>
          { canEdit(row)
            && <button className="btn btn-link"
                       title="Edit"
                       aria-label={`Edit ${row.label}`}
                       data-testid={`Edit ${row.label}`}
                       onClick={(e) => handleEdit(row.uri, e) }>
              <FontAwesomeIcon icon={faEdit} className="icon-lg" />
            </button>
          }
          { canCreate
            && <button type="button"
                       className="btn btn-link"
                       onClick={() => handleCopy(row.uri)}
                       title="Copy"
                       data-testid={`Copy ${row.label}`}
                       aria-label={`Copy ${row.label}`}>
              <FontAwesomeIcon icon={faCopy} className="icon-lg" />
            </button>
          }
        </div>
      </td>
    </tr>
  ))
}

SearchResultRows.propTypes = {
  searchResults: PropTypes.array,
  handleEdit: PropTypes.func,
  handleCopy: PropTypes.func,
  handleView: PropTypes.func,
  groupMap: PropTypes.map,
}

export default SearchResultRows
