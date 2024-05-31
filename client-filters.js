import { html } from './lit-html/lit-html.js'
import { ref } from './lit-html/directives/ref.js'

const OPERATORS = [
  '==',
  '!=',
  '>',
  '<',
  '>=',
  '<=',
  '&&',
  '||',
  'in',
  '!in',
  'includes',
  '!includes',
  'startsWith',
  '!startsWith',
  'endsWith',
  '!endsWith',
]

function deprecated(name) {
  console.warn('Warning: this method is deprecated:', name)
  return `[deprecated] ${name}`
}

export default function (config) {
  function onRef(stateEditor) {
    const editor = config.getEditor()
    return stateEditor && stateEditor.setEditor(editor)
  }

  return [{
    type: 'filter',
    id: 'toLocalDate',
    label: 'toLocalDate (i2k)',
    validate: input => !!input?.typeIds.map(t => t.toLowerCase()).includes('date') || !!input?.typeIds.map(t => t.toLowerCase()).includes('string'),
    output: type => type,
    apply: (str) => {
      const date = new Date(str)
      return date.toLocaleDateString()
    },
    options: {},
    quotedOptions: [],
  }, {
      type: 'filter',
      id: 'removeDefaultLang',
      label: 'removeDefaultLang (i2k)',
      validate: input => !!input?.typeIds.map(t => t.toLowerCase()).includes('string'),
      output: type => type,
      apply: (url) => {
        const languagesDefault = 'en'
        if (languagesDefault && url.startsWith('/' + languagesDefault)) {
          url = url.replace('/' + languagesDefault, '')
        }
        return url
      },
      options: {},
      quotedOptions: [],
  }, {
      type: 'filter',
      id: 'removeDefaultCollection',
      label: 'removeDefaultCollection (i2k)',
      validate: input => !!input?.typeIds.map(t => t.toLowerCase()).includes('string'),
      output: type => type,
      apply: (url) => {
        const defaultCollection = 'en'
        url = url.replace(`/${site.defaultCollection}/`, '/')
        return url
      },
      options: {},
      quotedOptions: [],
    }, {
      type: 'filter',
      id: 'filterDraft',
      label: 'filterDraft (i2k)',
      validate: input => !!input && input.kind === 'list',
      output: type => type,
      apply: list => list,
      options: {},
    }, {
      type: 'filter',
      id: 'if',
      label: 'if (i2k)',
      validate: input => true,
      output: type => type,
      apply: (value, { condition1, operator, condition2, elseValue = null }) => {
        switch (operator) {
          case '==':
            return condition1 === condition2 ? value : elseValue
          case '!=':
            return condition1 !== condition2 ? value : elseValue
          case '>':
            return condition1 > condition2 ? value : elseValue
          case '<':
            return condition1 < condition2 ? value : elseValue
          case '>=':
            return condition1 >= condition2 ? value : elseValue
          case '<=':
            return condition1 <= condition2 ? value : elseValue
          case '&&':
            return condition1 && condition2 ? value : elseValue
          case '||':
            return condition1 || condition2 ? value : elseValue
          case 'in':
            return condition2.includes(condition1) ? value : elseValue
          case '!in':
            return !condition2.includes(condition1) ? value : elseValue
          case 'includes':
            return condition1.includes(condition2) ? value : elseValue
          case '!includes':
            return !condition1.includes(condition2) ? value : elseValue
          case 'startsWith':
            return condition1.startsWith(condition2) ? value : elseValue
          case '!startsWith':
            return !condition1.startsWith(condition2) ? value : elseValue
          case 'endsWith':
            return condition1.endsWith(condition2) ? value : elseValue
          case '!endsWith':
            return !condition1.endsWith(condition2) ? value : elseValue
          default:
            throw new Error(`if filter error: unknown operator ${operator}`)
        }
      },
      options: {},
      quotedOptions: ['operator'],
      optionsKeys: ['condition1', 'operator', 'condition2'],
      optionsForm: (field, options) => {
        return html`
          <form>
            <div>
              <state-editor
                no-filters
                data-is-input
                class="ds-state-editor__options"
                value=${options.condition1 || []}
                name="condition1"
                ${ref(el => onRef(el))}
              >
                <label slot="label">First value</label>
              </state-editor>
            </div>
            <div>
              <label>operator</label>
              <select
                name="operator"
                style="background-color: unset; color: unset;"
              >
                ${OPERATORS.map(op => html`
                  <option value=${op} ?selected=${op === options.operator}>${op}</option>
                `)}
              </select>
            </div>
            <div>
              <state-editor
                no-filters
                data-is-input
                class="ds-state-editor__options"
                value=${options.condition2 || []}
                name="condition2"
                ${ref(el => onRef(el))}
              >
                <label slot="label">Second value</label>
              </state-editor>
            </div>
          </form>
          `
      },
    }, {
      type: 'filter',
      id: 'permalink',
      label: deprecated('permalink (i2k)'),
      validate: input => !!input?.typeIds.map(t => t.toLowerCase()).includes('string'),
      output: type => type,
      apply: (title, {collection}) => {
        // TODO: slugify tiltle, remove default language
        const lang = '/fr'
        return `${lang}${collection}/${title}/`
      },
      options: {},
      quotedOptions: ['collection'],
      optionsKeys: ['collection', 'lang'],
      optionsForm: (field, options) => {
        return html`
          <form>
            <div>
              <label>Collection</label>
              <input
                name="collection"
                type="text"
                value=${options.collection || ''}
              />
            </div>
            <div>
              <state-editor
                no-filters
                data-is-input
                class="ds-state-editor__options"
                value=${options.lang || []}
                name="lang"
                ${ref(el => onRef(el))}
              >
                <label slot="label">Lang</label>
              </state-editor>
            </div>
          </form>
          `
      },
    }, {
      type: 'filter',
      id: 'where_exp',
      label: 'where_exp (i2k)',
      validate: field => !!field && field.kind === 'list',
      output: type => type,
      apply: (list, { condition1, operator, condition2, elseValue = null }) => {
        throw new Error('where_exp filter not implemented')
      },
      options: {},
      quotedOptions: ['condition1', 'operator'],
      optionsKeys: ['condition1', 'operator', 'condition2'],
      optionsForm: (field, options) => {
        return html`
          <form>
            <div>
              <state-editor
                no-filters
                data-is-input
                class="ds-state-editor__options"
                value=${options.condition1 || []}
                name="condition1"
                ${ref(el => onRef(el))}
                root-type=${field?.typeIds[0] ?? ''}
              >
                <label slot="label">First value</label>
              </state-editor>
            </div>
            <div>
              <label>operator</label>
              <select
                name="operator"
                style="background-color: unset; color: unset;"
              >
                ${OPERATORS.map(op => html`
                  <option value=${op} ?selected=${op === options.operator}>${op}</option>
                `)}
              </select>
            </div>
            <div>
              <state-editor
                no-filters
                data-is-input
                class="ds-state-editor__options"
                value=${options.condition2 || []}
                name="condition2"
                ${ref(el => onRef(el))}
              >
                <label slot="label">Second value</label>
              </state-editor>
            </div>
          </form>
          `
      },
    }, {
      type: 'filter',
      id: 'prependDirectusUrl',
      label: deprecated('prependDirectusUrl (i2k)'),
      validate: input => !!input?.typeIds.map(t => t.toLowerCase()).includes('string'),
      output: type => type,
      apply: (url) => {
        return `/cms/${url}`
      },
      options: {},
      quotedOptions: [],
    }, {
      type: 'filter',
      id: 'prependDirectusUploadsFolder',
      label: 'prependDirectusUploadsFolder (i2k)',
      validate: input => !!input?.typeIds.map(t => t.toLowerCase()).includes('string'),
      output: type => type,
      apply: (url) => {
        return `/cms/assets/${url}`
      },
      options: {},
      quotedOptions: [],
    },
  ]
}
