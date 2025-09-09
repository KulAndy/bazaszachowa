/* eslint-disable react/jsx-curly-brace-presence */

import { useI18n } from "../i18n/I18nContext";

const TrendFunctionExplanation = () => {
  const { t } = useI18n();
  const currentYear = new Date().getFullYear();

  return (
    <>
      <details>
        <summary>{t("math.function")} &alpha;</summary>
        <div>
          <p>
            <math display="block" xmlns="http://www.w3.org/1998/Math/MathML">
              <mrow>
                <mi>b</mi>
                <mo>=</mo>
                <mn>10</mn>
                <mo>,</mo>
              </mrow>
              <mrow>
                <mi>c</mi>
                <mo>=</mo>
                <mn>{currentYear}</mn>
                <mo>,</mo>
              </mrow>
              <mrow>
                <mi>&alpha;</mi>
                <mo>=</mo>
                <mroot>
                  <mi>b</mi>
                  <mn>b</mn>
                </mroot>
              </mrow>
            </math>
          </p>
          <br />

          <p>
            <math display="block" xmlns="http://www.w3.org/1998/Math/MathML">
              <mrow>
                <mi>T</mi>
                <mo>=</mo>
                <munderover>
                  <mo>∑</mo>
                  <mrow>
                    <mi>i</mi>
                    <mo>=</mo>
                    <mn>1</mn>
                  </mrow>
                  <mi>n</mi>
                </munderover>
                <mrow>
                  <mo>(</mo>
                  <mo>|</mo>
                  <msub>
                    <mi>s</mi>
                    <mi>i</mi>
                  </msub>
                  <mo>|</mo>
                  <mo>×</mo>
                  <msup>
                    <mn>&alpha;</mn>
                    <mi>b</mi>
                  </msup>
                  <mo>)</mo>
                </mrow>
              </mrow>
            </math>
          </p>

          <p>
            <math display="block" xmlns="http://www.w3.org/1998/Math/MathML">
              <mrow>
                <mi>L</mi>
                <mo>(</mo>
                <mi>y</mi>
                <mo>)</mo>
                <mo>=</mo>
                <mrow>
                  <mo>{"{"}</mo>
                  <mtable>
                    <mtr>
                      <mtd>
                        <mn>1</mn>
                      </mtd>
                      <mtd>
                        <mi>y</mi>
                        <mo>&#x2264;</mo>
                        <mi>c</mi>
                        <mo>-</mo>
                        <mi>b</mi>
                        <mo>-</mo>
                        <mn>1</mn>
                      </mtd>
                    </mtr>
                    <mtr>
                      <mtd>
                        <mi>b</mi>
                        <mo>-</mo>
                        <mo>(</mo>
                        <mi>c</mi>
                        <mo>-</mo>
                        <mi>y</mi>
                        <mo>)</mo>
                      </mtd>
                      <mtd>
                        <mi>y</mi>
                        <mo>{">"}</mo>
                        <mi>c</mi>
                        <mo>-</mo>
                        <mi>b</mi>
                        <mo>-</mo>
                        <mn>1</mn>
                      </mtd>
                    </mtr>
                  </mtable>
                </mrow>
              </mrow>
            </math>
          </p>

          <p>
            <math display="block" xmlns="http://www.w3.org/1998/Math/MathML">
              <mrow>
                <msub>
                  <mi>v</mi>
                  <mi>i</mi>
                </msub>
                <mo>=</mo>
                <munderover>
                  <mo>∑</mo>
                  <mrow>
                    <mi>j=1</mi>
                  </mrow>
                  <mrow>
                    <mo>|</mo>
                    <msub>
                      <mi>s</mi>
                      <mi>i</mi>
                    </msub>
                    <mo>|</mo>
                  </mrow>
                </munderover>
                <msup>
                  <mn>&alpha;</mn>
                  <mi>
                    <mrow>
                      <mtext>L</mtext>
                      <mo>(</mo>
                      <msub>
                        <mi>s</mi>
                        <mi>ij</mi>
                      </msub>
                      <mo>)</mo>
                    </mrow>
                  </mi>
                </msup>
              </mrow>
            </math>
          </p>

          <p>
            <math display="block" xmlns="http://www.w3.org/1998/Math/MathML">
              <mrow>
                <mi>V</mi>
                <mo>=</mo>
                <mrow>
                  <mo>max</mo>
                  <mo>(</mo>
                  <mi>v</mi>
                  <mo>)</mo>
                </mrow>
              </mrow>
            </math>
          </p>

          <p>
            <math display="block" xmlns="http://www.w3.org/1998/Math/MathML">
              <mrow>
                <mi>Y</mi>
                <mo>=</mo>
                <mrow>
                  <mo>max</mo>
                  <mo>(</mo>
                  <mtext>rok w </mtext>
                  <mspace />
                  <mi>s</mi>
                  <mo>)</mo>
                </mrow>
              </mrow>
            </math>
          </p>

          <p>
            <math display="block" xmlns="http://www.w3.org/1998/Math/MathML">
              <mrow>
                <mi>d</mi>
                <mo>=</mo>
                <mn>1</mn>
                <mo>+</mo>
                <mrow>
                  <mo>{"{"}</mo>
                  <mtable>
                    <mtr>
                      <mtd>
                        <mi>b</mi>
                      </mtd>
                      <mtd>
                        <mi>Y</mi>
                        <mo>&#x2264;</mo>
                        <mi>c</mi>
                        <mo>-</mo>
                        <mi>b</mi>
                      </mtd>
                    </mtr>
                    <mtr>
                      <mtd>
                        <mi>c</mi>
                        <mo>-</mo>
                        <mi>Y</mi>
                        <mo>+</mo>
                        <mn>1</mn>
                      </mtd>
                      <mtd>
                        <mi>Y</mi>
                        <mo>{">"}</mo>
                        <mi>c</mi>
                        <mo>-</mo>
                        <mi>b</mi>
                      </mtd>
                    </mtr>
                  </mtable>
                </mrow>
              </mrow>
            </math>
          </p>

          <p>
            <math display="block" xmlns="http://www.w3.org/1998/Math/MathML">
              <mrow>
                <mi>&lambda;</mi>
                <mo>=</mo>
                <mrow>
                  <mo>{"{"}</mo>
                  <mtable>
                    <mtr>
                      <mtd>
                        <mn>1</mn>
                      </mtd>
                      <mtd>
                        <mi>V</mi>
                        <mo>=</mo>
                        <mn>0</mn>
                        <mspace />
                        <mo>∧</mo>
                        <mspace />
                        <mi>V</mi>
                        <mo>&#x2265;</mo>
                        <mfrac>
                          <mi>T</mi>
                          <mi>d</mi>
                        </mfrac>
                      </mtd>
                    </mtr>
                    <mtr>
                      <mtd>
                        <mfrac>
                          <mi>T</mi>
                          <mrow>
                            <mi>V</mi>
                            <mo>×</mo>
                            <mi>d</mi>
                          </mrow>
                        </mfrac>
                      </mtd>
                      <mtd>
                        <mn>~</mn>
                        <mo>{"("}</mo>
                        <mi>V</mi>
                        <mo>=</mo>
                        <mn>0</mn>
                        <mspace />
                        <mo>∧</mo>
                        <mspace />
                        <mi>V</mi>
                        <mo>&#x2265;</mo>
                        <mfrac>
                          <mi>T</mi>
                          <mi>d</mi>
                        </mfrac>
                        <mo>{")"}</mo>
                      </mtd>
                    </mtr>
                  </mtable>
                </mrow>
              </mrow>
            </math>
          </p>

          <p>
            <math display="block" xmlns="http://www.w3.org/1998/Math/MathML">
              <mrow>
                <mi>f</mi>
                <mo>(</mo>
                <mi>x</mi>
                <mo>)</mo>
                <mo>=</mo>
                <mfrac>
                  <mrow>
                    <msub>
                      <mi>v</mi>
                      <mi>x</mi>
                    </msub>
                    <mo>×</mo>
                    <mi>&lambda;</mi>
                  </mrow>
                  <mi>T</mi>
                </mfrac>
              </mrow>
            </math>
          </p>
          <strong>{t("math.consts")}:</strong>
          <ul>
            <li>
              <math xmlns="http://www.w3.org/1998/Math/MathML">
                <mi>b</mi>
                <mo>=</mo>
                <mn>10</mn>
              </math>
              : {t("math.alpha.b")}
            </li>
            <li>
              <math xmlns="http://www.w3.org/1998/Math/MathML">
                <mi>c</mi>
                <mo>=</mo>
                <mn>{currentYear}</mn>
              </math>
              : {t("math.alpha.c")}
            </li>
          </ul>
          <strong>{t("math.vars")}:</strong>
          <ul>
            <li>
              <math xmlns="http://www.w3.org/1998/Math/MathML">
                <mi>T</mi>
              </math>
              : {t("math.alpha.t")}
            </li>
            <li>
              <math xmlns="http://www.w3.org/1998/Math/MathML">
                <msub>
                  <mi>s</mi>
                  <mi>i</mi>
                </msub>
              </math>
              : {t("math.alpha.si")}{" "}
              <math xmlns="http://www.w3.org/1998/Math/MathML">
                <mi>i</mi>
              </math>
              .
            </li>
            <li>
              <math xmlns="http://www.w3.org/1998/Math/MathML">
                <mo>|</mo>
                <msub>
                  <mi>s</mi>
                  <mi>i</mi>
                </msub>
                <mo>|</mo>
              </math>
              : {t("math.alpha.abs_si")}{" "}
              <math xmlns="http://www.w3.org/1998/Math/MathML">
                <mi>i</mi>
              </math>
              .
            </li>
            <li>
              <math xmlns="http://www.w3.org/1998/Math/MathML">
                <msub>
                  <mi>s</mi>
                  <mi>ij</mi>
                </msub>
              </math>
              :
              <math xmlns="http://www.w3.org/1998/Math/MathML">
                <mspace />
                <mi>j</mi>
              </math>
              {t("math.alpha.nth_year")} .
            </li>

            <li>
              <math xmlns="http://www.w3.org/1998/Math/MathML">
                <msub>
                  <mi>v</mi>
                  <mi>i</mi>
                </msub>
              </math>
              : {t("math.alpha.vi")}{" "}
              <math xmlns="http://www.w3.org/1998/Math/MathML">
                <mi>i</mi>
              </math>
              .
            </li>
            <li>
              <math xmlns="http://www.w3.org/1998/Math/MathML">
                <mi>V</mi>
              </math>
              : {t("math.alpha.v")}{" "}
              <math xmlns="http://www.w3.org/1998/Math/MathML">
                <mi>v</mi>
              </math>
              .
            </li>
            <li>
              <math xmlns="http://www.w3.org/1998/Math/MathML">
                <mi>Y</mi>
              </math>
              : {t("math.alpha.y")}
            </li>
            <li>
              <math xmlns="http://www.w3.org/1998/Math/MathML">
                <mi>d</mi>
              </math>
              : {t("math.alpha.d")}
            </li>
            <li>
              <math xmlns="http://www.w3.org/1998/Math/MathML">
                <mi>&lambda;</mi>
              </math>
              : {t("math.alpha.lambda")}
            </li>
          </ul>
          <strong>{t("math.functions")}:</strong>
          <ul>
            <li>
              <math xmlns="http://www.w3.org/1998/Math/MathML">
                <mi>L</mi>
                <mo>(</mo>
                <mi>y</mi>
                <mo>)</mo>
              </math>
              : {t("math.alpha.l")}{" "}
              <math xmlns="http://www.w3.org/1998/Math/MathML">
                <mi>y</mi>
              </math>
              .
            </li>
            <li>
              <math xmlns="http://www.w3.org/1998/Math/MathML">
                <mi>f</mi>
                <mo>(</mo>
                <mi>x</mi>
                <mo>)</mo>
              </math>
              : {t("math.alpha.f")}{" "}
              <math xmlns="http://www.w3.org/1998/Math/MathML">
                <mi>x</mi>
              </math>
              .
            </li>
          </ul>
        </div>
      </details>
      <details>
        <summary>{t("math.function")} &beta;</summary>
        <div>
          <p>
            <math display="block" xmlns="http://www.w3.org/1998/Math/MathML">
              <mi>&epsilon;</mi>
              <mo>=</mo>
              <mi>0,1</mi>
            </math>
          </p>
          <p>
            <math display="block" xmlns="http://www.w3.org/1998/Math/MathML">
              <mrow>
                <mn>f</mn>
                <mo>(</mo>
                <msub>
                  <mn>x</mn>
                  <mi>1</mi>
                </msub>
                <mo>,</mo>
                <msub>
                  <mn>y</mn>
                  <mi>1</mi>
                </msub>
                <mo>)</mo>
                <mo>=</mo>
                <mrow>
                  <mo>{"{"}</mo>
                  <mtable>
                    <mtr>
                      <mtd>
                        <msup>
                          <mi>&epsilon;</mi>
                          <mn>2</mn>
                        </msup>
                      </mtd>
                      <mtd>
                        <msub>
                          <mn>x</mn>
                          <mi>1</mi>
                        </msub>
                        <mo>=</mo>
                        <mi>0</mi>
                        <mo>&#x2228;</mo>
                        <msub>
                          <mn>n</mn>
                          <mi>1</mi>
                        </msub>
                        <mo>=</mo>
                        <mi>0</mi>
                      </mtd>
                    </mtr>
                    <mtr>
                      <mtd>
                        <mfrac>
                          <mi>1</mi>
                          <mi>2</mi>
                        </mfrac>
                        <mo>+</mo>
                        <mfrac>
                          <mi>1</mi>
                          <mi>2</mi>
                        </mfrac>
                        <mo>[</mo>
                        <mo>max</mo>
                        <mo>(</mo>
                        <mfrac>
                          <mrow>
                            <msub>
                              <mi>x</mi>
                              <mn>1</mn>
                            </msub>
                          </mrow>
                          <mrow>
                            <msub>
                              <mi>n</mi>
                              <mn>1</mn>
                            </msub>
                          </mrow>
                        </mfrac>
                        <mo>,</mo>
                        <mi>&epsilon;</mi>
                        <mo>)</mo>
                        <mo>]</mo>
                        <mo>[</mo>
                        <mo>max</mo>
                        <mo>(</mo>
                        <mfrac>
                          <mrow>
                            <msub>
                              <mi>y</mi>
                              <mn>1</mn>
                            </msub>
                          </mrow>
                          <mrow>
                            <msub>
                              <mi>x</mi>
                              <mn>1</mn>
                            </msub>
                          </mrow>
                        </mfrac>
                        <mo>,</mo>
                        <mi>&epsilon;</mi>
                        <mo>)</mo>
                        <mo>]</mo>
                      </mtd>
                      <mtd>
                        <msub>
                          <mn>x</mn>
                          <mi>1</mi>
                        </msub>
                        <mo>&#x2260;</mo>
                        <mi>0</mi>
                        <mo>&#x2227;</mo>
                        <msub>
                          <mn>n</mn>
                          <mi>1</mi>
                        </msub>
                        <mo>&#x2260;</mo>
                        <mi>0</mi>
                      </mtd>
                    </mtr>
                  </mtable>
                </mrow>
              </mrow>
            </math>
          </p>
          <p>
            <math display="block" xmlns="http://www.w3.org/1998/Math/MathML">
              <mrow>
                <mn>f</mn>
                <mo>(</mo>
                <msub>
                  <mn>x</mn>
                  <mi>i</mi>
                </msub>
                <mo>,</mo>
                <msub>
                  <mn>y</mn>
                  <mi>i</mi>
                </msub>
                <mo>)</mo>
                <mo>=</mo>
                <mrow>
                  <mo>{"{"}</mo>
                  <mtable>
                    <mtr>
                      <mtd>
                        <msup>
                          <mi>&epsilon;</mi>
                          <mn>2</mn>
                        </msup>
                      </mtd>
                      <mtd>
                        <msub>
                          <mn>x</mn>
                          <mi>i</mi>
                        </msub>
                        <mo>=</mo>
                        <mi>0</mi>
                        <mo>&#x2228;</mo>
                        <msub>
                          <mn>n</mn>
                          <mi>i</mi>
                        </msub>
                        <mo>=</mo>
                        <mi>0</mi>
                      </mtd>
                    </mtr>
                    <mtr>
                      <mtd>
                        <mfrac>
                          <mi>1</mi>
                          <mi>2</mi>
                        </mfrac>
                        <mo>[</mo>
                        <mo>max</mo>
                        <mo>(</mo>
                        <mfrac>
                          <mrow>
                            <msub>
                              <mi>x</mi>
                              <mn>i</mn>
                            </msub>
                          </mrow>
                          <mrow>
                            <msub>
                              <mi>n</mi>
                              <mn>i</mn>
                            </msub>
                          </mrow>
                        </mfrac>
                        <mo>,</mo>
                        <mi>&epsilon;</mi>
                        <mo>)</mo>
                        <mo>]</mo>
                        <mo>[</mo>
                        <mo>max</mo>
                        <mo>(</mo>
                        <mfrac>
                          <mrow>
                            <msub>
                              <mi>y</mi>
                              <mn>i</mn>
                            </msub>
                          </mrow>
                          <mrow>
                            <msub>
                              <mi>x</mi>
                              <mn>i</mn>
                            </msub>
                          </mrow>
                        </mfrac>
                        <mo>,</mo>
                        <mi>&epsilon;</mi>
                        <mo>)</mo>
                        <mo>]</mo>
                        <mo>+</mo>
                        <mfrac>
                          <mi>1</mi>
                          <mi>2</mi>
                        </mfrac>
                        <mn>f</mn>
                        <mo>(</mo>
                        <msub>
                          <mn>x</mn>
                          <mi>i-1</mi>
                        </msub>
                        <mo>,</mo>
                        <msub>
                          <mn>y</mn>
                          <mi>i-1</mi>
                        </msub>
                        <mo>)</mo>
                      </mtd>
                      <mtd>
                        <msub>
                          <mn>x</mn>
                          <mi>i</mi>
                        </msub>
                        <mo>&#x2260;</mo>
                        <mi>0</mi>
                        <mo>&#x2227;</mo>
                        <msub>
                          <mn>n</mn>
                          <mi>i</mi>
                        </msub>
                        <mo>&#x2260;</mo>
                        <mi>0</mi>
                      </mtd>
                    </mtr>
                  </mtable>
                </mrow>
              </mrow>
            </math>
          </p>
          <strong>{t("math.consts")}:</strong>
          <ul>
            <li>&epsilon;:{t("math.beta.epsilon")} </li>
          </ul>
          <strong>{t("math.vars")}:</strong>
          <ul>
            <li>
              <math xmlns="http://www.w3.org/1998/Math/MathML">
                <msub>
                  <mn>x</mn>
                  <mi>i</mi>
                </msub>
                <mtext>:{t("math.beta.xi")} i </mtext>
              </math>
            </li>
            <li>
              <math xmlns="http://www.w3.org/1998/Math/MathML">
                <msub>
                  <mn>y</mn>
                  <mi>i</mi>
                </msub>
                <mtext>:{t("math.beta.yi")} i </mtext>
              </math>
            </li>
            <li>
              <math xmlns="http://www.w3.org/1998/Math/MathML">
                <msub>
                  <mn>n</mn>
                  <mi>i</mi>
                </msub>
                <mtext>:{t("math.beta.ni")} i </mtext>
              </math>
            </li>
          </ul>
        </div>
      </details>
    </>
  );
};

export default TrendFunctionExplanation;
