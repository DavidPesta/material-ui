// @flow
// A grid component using the following libs as inspiration.
//
// For the implementation:
// - http://v4-alpha.getbootstrap.com/layout/flexbox-grid/
// - https://github.com/kristoferjoseph/flexboxgrid/blob/master/src/css/flexboxgrid.css
// - https://github.com/roylee0704/react-flexbox-grid
// - https://material.angularjs.org/latest/layout/introduction
//
// Follow this flexbox Guide to better understand the underlying model:
// - https://css-tricks.com/snippets/css/a-guide-to-flexbox/

import React from 'react';
import type { ElementType, Node } from 'react';
import classNames from 'classnames';
import withStyles from '../styles/withStyles';
import { keys as breakpointKeys } from '../styles/createBreakpoints';
import requirePropFactory from '../utils/requirePropFactory';
import Hidden from '../Hidden';
import type { HiddenProps } from '../Hidden/types';

const GUTTERS = [0, 8, 16, 24, 40];
const GRID_SIZES = [true, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

function generateGrid(globalStyles, theme, breakpoint) {
  // For the auto layouting
  const styles = {
    [`grid-${breakpoint}`]: {
      flexBasis: 0,
      flexGrow: 1,
      maxWidth: '100%',
    },
  };

  GRID_SIZES.forEach(size => {
    if (typeof size === 'boolean') {
      // Skip the first one as handle above.
      return;
    }

    // Only keep 6 significant numbers.
    const width = `${Math.round(size / 12 * Math.pow(10, 6)) / Math.pow(10, 4)}%`;

    /* eslint-disable max-len */
    // Close to the bootstrap implementation:
    // https://github.com/twbs/bootstrap/blob/b0508a975d711d6b24c01f57dd5445c22699fac4/scss/mixins/_grid.scss#L69
    /* eslint-enable max-len */
    styles[`grid-${breakpoint}-${size}`] = {
      flexBasis: width,
      maxWidth: width,
    };
  });

  // No need for a media query for the first size.
  if (breakpoint === 'xs') {
    Object.assign(globalStyles, styles);
  } else {
    globalStyles[theme.breakpoints.up(breakpoint)] = styles;
  }
}

function generateGutter(theme, breakpoint) {
  const styles = {};

  GUTTERS.forEach((spacing, index) => {
    if (index === 0) {
      // Skip the default style.
      return;
    }

    styles[`spacing-${breakpoint}-${spacing}`] = {
      margin: -spacing / 2,
      width: `calc(100% + ${spacing}px)`,
      '& > $typeItem': {
        padding: spacing / 2,
      },
    };
  });

  return styles;
}

// Default CSS values
// flex: '0 1 auto',
// flexDirection: 'row',
// alignItems: 'flex-start',
// flexWrap: 'nowrap',
// justifyContent: 'flex-start',
export const styles = (theme: Object) => ({
  typeContainer: {
    boxSizing: 'border-box',
    display: 'flex',
    flexWrap: 'wrap',
    width: '100%',
  },
  typeItem: {
    boxSizing: 'border-box',
    flex: '0 0 auto',
    margin: '0', // For instance, it's useful when used with a `figure` element.
  },
  'direction-xs-column': {
    flexDirection: 'column',
  },
  'direction-xs-column-reverse': {
    flexDirection: 'column-reverse',
  },
  'direction-xs-row-reverse': {
    flexDirection: 'row-reverse',
  },
  'wrap-xs-nowrap': {
    flexWrap: 'nowrap',
  },
  'wrap-xs-wrap-reverse': {
    flexWrap: 'wrap-reverse',
  },
  'align-items-xs-center': {
    alignItems: 'center',
  },
  'align-items-xs-flex-start': {
    alignItems: 'flex-start',
  },
  'align-items-xs-flex-end': {
    alignItems: 'flex-end',
  },
  'align-items-xs-baseline': {
    alignItems: 'baseline',
  },
  'align-content-xs-center': {
    alignContent: 'center',
  },
  'align-content-xs-flex-start': {
    alignContent: 'flex-start',
  },
  'align-content-xs-flex-end': {
    alignContent: 'flex-end',
  },
  'align-content-xs-space-between': {
    alignContent: 'space-between',
  },
  'align-content-xs-space-around': {
    alignContent: 'space-around',
  },
  'justify-xs-center': {
    justifyContent: 'center',
  },
  'justify-xs-flex-end': {
    justifyContent: 'flex-end',
  },
  'justify-xs-space-between': {
    justifyContent: 'space-between',
  },
  'justify-xs-space-around': {
    justifyContent: 'space-around',
  },
  ...generateGutter(theme, 'xs'),
  ...breakpointKeys.reduce((accumulator, key) => {
    // Use side effect over immutability for better performance.
    generateGrid(accumulator, theme, key);
    return accumulator;
  }, {}),
});

export type GridSizes = boolean | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

type AlignContent =
  | 'stretch'
  | 'center'
  | 'flex-start'
  | 'flex-end'
  | 'space-between'
  | 'space-around';

type AlignItems = 'flex-start' | 'center' | 'flex-end' | 'stretch' | 'baseline';

type Direction = 'row' | 'row-reverse' | 'column' | 'column-reverse';

type Justify = 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around';

type Spacing = 0 | 8 | 16 | 24 | 40;

type Wrap = 'nowrap' | 'wrap' | 'wrap-reverse';

type ProvidedProps = {
  classes: Object,
  theme?: Object,
};

type DefaultProps = {
  alignContent?: AlignContent,
  alignItems: AlignItems,
  component: ElementType,
  container: boolean,
  direction: Direction,
  item: boolean,
  justify: Justify,
  spacing: Spacing,
  wrap: Wrap,
};

export type Props = {
  /**
   * Other base element props.
   */
  [otherProp: string]: any,
  /**
   * The content of the component.
   */
  children?: Node,
  /**
   * Useful to extend the style applied to components.
   */
  classes?: Object,
  /**
   * @ignore
   */
  className?: string,
  /**
   * The component used for the root node.
   * Either a string to use a DOM element or a component.
   */
  component: ElementType,
  /**
   * If `true`, the component will have the flex *container* behavior.
   * You should be wrapping *items* with a *container*.
   */
  container: boolean,
  /**
   * If `true`, the component will have the flex *item* behavior.
   * You should be wrapping *items* with a *container*.
   */
  item: boolean,
  /**
   * Defines the `align-content` style property.
   * It's applied for all screen sizes.
   */
  alignContent?: AlignContent,
  /**
   * Defines the `align-items` style property.
   * It's applied for all screen sizes.
   */
  alignItems: AlignItems,
  /**
   * Defines the `flex-direction` style property.
   * It is applied for all screen sizes.
   */
  direction: Direction,
  /**
   * Defines the space between the type `item` component.
   * It can only be used on a type `container` component.
   */
  spacing: Spacing,
  /**
   * If provided, will wrap with [Hidden](/api/hidden) component and given properties.
   */
  hidden?: HiddenProps,
  /**
   * Defines the `justify-content` style property.
   * It is applied for all screen sizes.
   */
  justify: Justify,
  /**
   * Defines the `flex-wrap` style property.
   * It's applied for all screen sizes.
   */
  wrap: Wrap,
  /**
   * Defines the number of grids the component is going to use.
   * It's applied for all the screen sizes with the lowest priority.
   */
  xs?: GridSizes,
  /**
   * Defines the number of grids the component is going to use.
   * It's applied for the `sm` breakpoint and wider screens if not overridden.
   */
  sm?: GridSizes,
  /**
   * Defines the number of grids the component is going to use.
   * It's applied for the `md` breakpoint and wider screens if not overridden.
   */
  md?: GridSizes,
  /**
   * Defines the number of grids the component is going to use.
   * It's applied for the `lg` breakpoint and wider screens if not overridden.
   */
  lg?: GridSizes,
  /**
   * Defines the number of grids the component is going to use.
   * It's applied for the `xl` breakpoint and wider screens.
   */
  xl?: GridSizes,
};

class Grid extends React.Component<ProvidedProps & Props> {
  static defaultProps: DefaultProps = {
    alignContent: 'stretch',
    alignItems: 'stretch',
    component: 'div',
    container: false,
    direction: 'row',
    hidden: undefined,
    item: false,
    justify: 'flex-start',
    spacing: 16,
    wrap: 'wrap',
  };

  render() {
    const {
      classes,
      className: classNameProp,
      component: ComponentProp,
      container,
      item,
      alignContent,
      alignItems,
      direction,
      spacing,
      hidden,
      justify,
      wrap,
      xs,
      sm,
      md,
      lg,
      xl,
      ...other
    } = this.props;

    const className = classNames(
      {
        [classes.typeContainer]: container,
        [classes.typeItem]: item,
        [classes[`spacing-xs-${String(spacing)}`]]: container && spacing !== 0,
        [classes[`direction-xs-${String(direction)}`]]: direction !== Grid.defaultProps.direction,
        [classes[`wrap-xs-${String(wrap)}`]]: wrap !== Grid.defaultProps.wrap,
        [classes[`align-items-xs-${String(alignItems)}`]]:
          alignItems !== Grid.defaultProps.alignItems,
        [classes[`align-content-xs-${String(alignContent)}`]]:
          alignContent !== Grid.defaultProps.alignContent,
        [classes[`justify-xs-${String(justify)}`]]: justify !== Grid.defaultProps.justify,
        [classes['grid-xs']]: xs === true,
        [classes[`grid-xs-${String(xs)}`]]: xs && xs !== true,
        [classes['grid-sm']]: sm === true,
        [classes[`grid-sm-${String(sm)}`]]: sm && sm !== true,
        [classes['grid-md']]: md === true,
        [classes[`grid-md-${String(md)}`]]: md && md !== true,
        [classes['grid-lg']]: lg === true,
        [classes[`grid-lg-${String(lg)}`]]: lg && lg !== true,
        [classes['grid-xl']]: xl === true,
        [classes[`grid-xl-${String(xl)}`]]: xl && xl !== true,
      },
      classNameProp,
    );
    const gridProps = { className, ...other };

    if (hidden) {
      return (
        <Hidden {...hidden}>
          <ComponentProp {...gridProps} />
        </Hidden>
      );
    }

    return <ComponentProp {...gridProps} />;
  }
}

// Add a wrapper component to generate some helper messages in the development
// environment.
/* eslint-disable react/no-multi-comp */
/* eslint-disable react/prefer-stateless-function */
// eslint-disable-next-line import/no-mutable-exports
let GridWrapper = Grid;

if (process.env.NODE_ENV !== 'production') {
  const requireProp = requirePropFactory('Grid');

  GridWrapper = (props: any) => <Grid {...props} />;

  // $FlowFixMe - cannot mix legacy propTypes with current HOC pattern - https://github.com/facebook/flow/issues/4644#issuecomment-332530909
  GridWrapper.propTypes = {
    alignContent: requireProp('container'),
    alignItems: requireProp('container'),
    direction: requireProp('container'),
    justify: requireProp('container'),
    lg: requireProp('item'),
    md: requireProp('item'),
    sm: requireProp('item'),
    spacing: requireProp('container'),
    wrap: requireProp('container'),
    xs: requireProp('item'),
  };
}

export default withStyles(styles, { name: 'MuiGrid' })(GridWrapper);
