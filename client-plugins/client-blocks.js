const SLIDESHOW_PLUGIN_ID = 'slideshow-i2k'
export default function (config) {
  config.on('silex:grapesjs:end', () => {
    const editor = config.getEditor()
    // Slideshow
    function updateShortcode(component) {
      const { options } = component.get('attributes')
      const componentsToKeep = component.components()
        .filter(c => c.view?.el?.nodeType === 1)
      component.components(`
        {%- capture options -%}
          ${options}
        {%- endcapture -%}
        {% slideshow options %}
          <div class="replace_content"></div>
        {% endslideshow %}
      `)
      const replaceContentDiv = component.components().find(c => c.getClasses().includes('replace_content'))
      if(!replaceContentDiv) {
        console.error('No replace_content found', { component, componentsToKeep })
        return
      }
      replaceContentDiv.replaceWith(componentsToKeep)
    }
    editor.BlockManager.add(SLIDESHOW_PLUGIN_ID, {
      label: 'Slideshow',
      category: 'Internet 2000',
      attributes: { class: 'fa fa-image' },
      id: SLIDESHOW_PLUGIN_ID,
      content: {
        type: SLIDESHOW_PLUGIN_ID,
        components: ['<div>This is a slide</div>'],
      },
      // The component `image` is activatable (shows the Asset Manager).
      activate: true,
      // select: true, // Default with `activate: true`
    })
    editor.DomComponents.addType(SLIDESHOW_PLUGIN_ID, {
      model: {
        defaults: {
          traits: [
            {
              type: `${SLIDESHOW_PLUGIN_ID}-options`,
              label: 'Options',
              name: 'options',
              placeholder: '{ ...splide options... }',
              default: '{}',
            },
          ],
        },
      },
    })
    editor.TraitManager.addType(`${SLIDESHOW_PLUGIN_ID}-options`, {
      onEvent({ component }) {
        updateShortcode(component)
      },
    })
  })
}
