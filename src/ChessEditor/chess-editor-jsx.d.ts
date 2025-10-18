// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from "react";

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      piece: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;
    }
  }
}
