import { Plugin } from '@fe/context'
import store from '@fe/support/store'

export default {
  name: 'status-control-center',
  register: ctx => {
    ctx.statusBar.tapMenus(menus => {
      menus['status-bar-control-center'] = {
        id: 'status-bar-control-center',
        position: 'right',
        tips: ctx.i18n.t('control-center.control-center', ctx.command.getKeysLabel('control-center.toggle')),
        icon: 'sliders-h-solid',
        onClick: () => ctx.controlCenter.toggle()
      }
    })

    let count = 0
    ctx.store.subscribe(() => {
      if (count === 0) {
        ctx.controlCenter.tapSchema(schema => {
          schema.switch.items.push(
            {
              type: 'btn',
              icon: 'side-bar',
              title: ctx.i18n.t('control-center.switch.side-bar', ctx.command.getKeysLabel('layout.toggle-side')),
              checked: ctx.store.state.showSide,
              onClick: () => {
                ctx.layout.toggleSide()
              }
            },
            {
              type: 'btn',
              icon: 'edit-solid',
              title: ctx.i18n.t('control-center.switch.editor', ctx.command.getKeysLabel('layout.toggle-editor')),
              checked: ctx.store.state.showEditor,
              onClick: () => {
                ctx.layout.toggleEditor()
              }
            },
            {
              type: 'btn',
              icon: 'eye-regular',
              title: ctx.i18n.t('control-center.switch.view', ctx.command.getKeysLabel('layout.toggle-view')),
              checked: ctx.store.state.showView,
              onClick: () => {
                ctx.layout.toggleView()
              }
            },
            {
              type: 'btn',
              icon: 'text-width-solid',
              title: ctx.i18n.t('control-center.switch.word-wrap', ctx.command.getKeysLabel('editor.toggle-wrap')),
              checked: ctx.store.state.wordWrap === 'on',
              onClick: () => {
                ctx.editor.toggleWrap()
              }
            },
            {
              type: 'btn',
              icon: 'paint-roller',
              title: ctx.i18n.t('control-center.switch.sync-rendering'),
              checked: ctx.store.state.autoPreview,
              onClick: () => {
                ctx.view.toggleAutoPreview()
                if (ctx.store.state.autoPreview) {
                  ctx.view.refresh()
                }
              }
            },
          )
        })
      } else {
        ctx.controlCenter.refresh()
      }

      count++
    })

    ctx.controlCenter.tapSchema(schema => {
      schema.navigation.items.push(
        {
          type: 'btn',
          icon: 'sync-alt-solid',
          flat: true,
          title: ctx.i18n.t('control-center.navigation.refresh'),
          onClick: () => {
            ctx.view.refresh()
            ctx.controlCenter.toggle(false)
          }
        },
        {
          type: 'btn',
          icon: 'search-solid',
          flat: true,
          title: ctx.i18n.t('control-center.navigation.goto', ctx.command.getKeysLabel('filter.show-quick-open')),
          onClick: () => {
            ctx.action.getActionHandler('filter.show-quick-open')()
            ctx.controlCenter.toggle(false)
          }
        },
      )
    })

    store.watch(() => store.state.autoPreview, ctx.statusBar.refreshMenu)
  }
} as Plugin