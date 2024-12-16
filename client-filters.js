import { html } from './lit-html/lit-html.js'

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
    options: {
      format: 'LL',
    },
    quotedOptions: [format],
    optionsKeys: ['format', 'lang'],
    optionsForm: (selected, field, options, stateName) => {
      // function (date, lang = this.page.lang, format = 'LL') {
      // return moment(date).locale(lang).format(format)
      //   type LongDateFormatKey = 'LTS' | 'LT' | 'L' | 'LL' | 'LLL' | 'LLLL' | 'lts' | 'lt' | 'l' | 'll' | 'lll' | 'llll';
      return html`
        <form>
          <div>
            <state-editor
              no-filters
              data-is-input
              class="ds-state-editor__options"
              value=${options.lang || []}
              name="lang"
              .editor=${config.getEditor()}
              .selected=${selected}
            >
              <label
                slot="label"
                style="display: flex; align-items: center;"
              >Lang
                <span
                  style="margin-left: 5px;"
                  title="The language to use for the date. Defaults to current page language"
                >ⓘ</span>
              </label>
            </state-editor>
            <fieldset
              style="border: none;"
            >
              <label
                style="font-size: 1rem;display: flex;flex-direction: column; align-items: flex-start;"
              >Format
                <select
                  name="format"
                  style="background-color: unset; color: unset; margin: 5px 0; width: 100%;"
                >
                  <option value="LL" ?selected=${options.format === 'LL'}>LL</option>
                  <option value="LTS" ?selected=${options.format === 'LTS'}>LTS</option>
                  <option value="LT" ?selected=${options.format === 'LT'}>LT</option>
                  <option value="L" ?selected=${options.format === 'L'}>L</option>
                  <option value="LLL" ?selected=${options.format === 'LLL'}>LLL</option>
                  <option value="LLLL" ?selected=${options.format === 'LLLL'}>LLLL</option>
                  <option value="lts" ?selected=${options.format === 'lts'}>lts</option>
                  <option value="lt" ?selected=${options.format === 'lt'}>lt</option>
                  <option value="l" ?selected=${options.format === 'l'}>l</option>
                  <option value="ll" ?selected=${options.format === 'll'}>ll</option>
                  <option value="lll" ?selected=${options.format === 'lll'}>lll</option>
                  <option value="llll" ?selected=${options.format === 'llll'}>llll</option>
                </select>
              </label>
              <p>Check the <a href="https://momentjs.com/docs/#/displaying/format/" target="_blank">moment.js documentation</a> for more information</p>
              <details
                style="background-color: var(--ds-button-color); color: var(--ds-button-bg); margin: 0; padding: 0;"
              >
                <summary
                  style="cursor: pointer; font-weight: bold; color: var(--ds-button-bg); padding: 0;"
                >Examples</summary>
                <p>LL: September 4, 1986</p>
                <p>LTS: 8:30:25 PM</p>
                <p>LT: 8:30 PM</p>
                <p>L: 09/04/1986</p>
                <p>LLL: September 4, 1986 8:30 PM</p>
                <p>LLLL: Thursday, September 4, 1986 8:30 PM</p>
                <p>lts: 8:30:25 PM</p>
                <p>lt: 8:30 PM</p>
                <p>l: 09/04/1986</p>
                <p>ll: Sep 4, 1986</p>
                <p>lll: Sep 4, 1986 8:30 PM</p>
                <p>llll: Thu, Sep 4, 1986 8:30 PM</p>
              </details>
            </fieldset>
          </div>
        </form>
        `
    },
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
      validate: input => !!input,
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
      optionsKeys: ['condition1', 'operator', 'condition2', 'elseValue'],
      optionsForm: (selected, field, options, stateName) => {
        return html`
          <form>
            <div>
              <state-editor
                no-filters
                data-is-input
                class="ds-state-editor__options"
                value=${options.condition1 || []}
                name="condition1"
                .editor=${config.getEditor()}
                .selected=${selected}
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
                .editor=${config.getEditor()}
                .selected=${selected}
              >
                <label slot="label">Second value</label>
              </state-editor>
            </div>
            <div>
              <state-editor
                no-filters
                data-is-input
                class="ds-state-editor__options"
                value=${options.elseValue || []}
                name="elseValue"
                .editor=${config.getEditor()}
                .selected=${selected}
              >
                <label slot="label">Else value</label>
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
      optionsForm: (selected, field, options, stateName) => {
        return html`
          <form>
            <div>
              <state-editor
                no-filters
                data-is-input
                class="ds-state-editor__options"
                value=${options.condition1 || []}
                name="condition1"
                .editor=${config.getEditor()}
                .selected=${selected}
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
                .editor=${config.getEditor()}
                .selected=${selected}
              >
                <label slot="label">Second value</label>
              </state-editor>
            </div>
          </form>
          `
      },
    }, {
      type: 'filter',
      id: 'copyImage',
      label: 'copyImage (i2k)',
      validate: input => !!input?.typeIds.map(t => t.toLowerCase()).includes('string'),
      output: type => type,
      apply: (url) => url,
      options: {},
      quotedOptions: [],
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
      optionsForm: (selected, field, options, stateName) => {
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
                .editor=${config.getEditor()}
                .selected=${selected}
              >
                <label slot="label">Lang</label>
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
