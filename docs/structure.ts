export const STRUCTURE = [
  {
    type: 'section',
    name: 'Getting Started',
    children: [
      {
        type: 'page',
        name: 'Installation',
        children: [
          {
            type: 'block',
            block: 'markdown',
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
        children: [
          {
            type: 'block',
            block: 'class-description',
            klass: 'NgaLayoutComponent',
          },
          {
            type: 'block',
            block: 'class-inputs',
            klass: 'NgaLayoutComponent',
          },
          {
            type: 'block',
            block: 'class-outputs',
            klass: 'NgaLayoutComponent',
          },
          {
            type: 'block',
            block: 'class-examples',
            klass: 'NgaLayoutComponent',
          },

          // we may have a couple of custom components like header, text, html (or do we?)
          {
            type: 'type',
            block: 'header',
            text: 'Children components containers',
          },
          // tag: component will render all of the above (description, inputs, outputs, examples, runnable examples)
          {
            type: 'block',
            block: 'class-component',
            klass: 'NgaLayoutColumnComponent',
          },
        ],
      },
      {
        type: 'page',
        name: 'Sidebar',
        children: [
          {
            type: 'block',
            block: 'class-description',
            klass: 'NgaSidebarComponent',
          },
          {
            type: 'block',
            block: 'class-inputs',
            klass: 'NgaSidebarComponent',
          },
          {
            type: 'block',
            block: 'class-outputs',
            klass: 'NgaSidebarComponent',
          },
          {
            type: 'block',
            block: 'class-examples',
            klass: 'NgaSidebarComponent',
          },
          {
            type: 'block',
            block: 'class-theme',
            klass: 'NgaSidebarComponent',
          },

          // we may have a couple of custom components like header, text, html (or do we?)
          {
            type: 'block',
            block: 'header',
            text: 'Children components',
          },
          // tag: component will render all of the above (description, inputs, outputs, examples, runnable examples)
          {
            type: 'block',
            block: 'class-description',
            klass: 'NgaSidebarHeaderComponent',
          },
          {
            type: 'block',
            block: 'class-description',
            klass: 'NgaSidebarFooterComponent',
          },
          {
            type: 'block',
            block: 'class-description',
            klass: 'NgaSidebarService',
          },
          {
            type: 'block',
            block: 'class-methods',
            klass: 'NgaSidebarService',
          },
        ],
      },


    ],
  },
];
