export const STRUCTURE = [
  {
    type: 'section',
    name: 'Getting Started',
    children: [
      {
        type: 'page',
        name: 'Installation',
        blocks: [
          {
            type: 'markdown',
            source: 'pages/installation.md'
          }
        ]
      }
    ],
  },
  {
    type: 'section',
    name: 'UI Components',
    children: [
      {
        type: 'page',
        name: 'Layout',
        blocks: [
          {
            type: 'generated',
            tag: 'description',
            klass: 'NgaLayoutComponent',
          },
          {
            type: 'generated',
            tag: 'inputs',
            klass: 'NgaLayoutComponent',
          },
          {
            type: 'generated',
            tag: 'outputs',
            klass: 'NgaLayoutComponent',
          },
          {
            type: 'generated',
            tag: 'examples',
            klass: 'NgaLayoutComponent',
          },

          // we may have a couple of custom components like header, text, html (or do we?)
          {
            type: 'header',
            text: 'Children components containers',
          },
          // tag: component will render all of the above (description, inputs, outputs, examples, runnable examples)
          {
            type: 'generated',
            tag: 'component',
            klass: 'NgaLayoutColumnComponent',
          },
        ],
      },
      {
        type: 'page',
        name: 'Sidebar',
        blocks: [
          {
            type: 'generated',
            tag: 'description',
            klass: 'NgaSidebarComponent',
          },
          {
            type: 'generated',
            tag: 'inputs',
            klass: 'NgaSidebarComponent',
          },
          {
            type: 'generated',
            tag: 'outputs',
            klass: 'NgaSidebarComponent',
          },
          {
            type: 'generated',
            tag: 'examples',
            klass: 'NgaSidebarComponent',
          },
          {
            type: 'generated',
            tag: 'theme',
            klass: 'NgaSidebarComponent',
          },

          // we may have a couple of custom components like header, text, html (or do we?)
          {
            type: 'header',
            text: 'Children components',
          },
          // tag: component will render all of the above (description, inputs, outputs, examples, runnable examples)
          {
            type: 'generated',
            tag: 'description',
            klass: 'NgaSidebarHeaderComponent',
          },
          {
            type: 'generated',
            tag: 'description',
            klass: 'NgaSidebarFooterComponent',
          },
          {
            type: 'generated',
            tag: 'description',
            klass: 'NgaSidebarService',
          },
        ],
      },


    ],
  },
];
