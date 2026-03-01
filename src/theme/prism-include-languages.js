import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';
import siteConfig from '@generated/docusaurus.config';

export default function prismIncludeLanguages(PrismObject) {
  if (ExecutionEnvironment.canUseDOM) {
    const {
      themeConfig: {prism},
    } = siteConfig;

    globalThis.Prism = PrismObject;

    // Load additional languages from config
    prism.additionalLanguages.forEach((lang) => {
      require(`prismjs/components/prism-${lang}`);
    });

    // Register Vyper as a Python-based language with Vyper-specific extensions
    PrismObject.languages.vyper = PrismObject.languages.extend('python', {
      keyword: /\b(?:def|return|if|else|elif|for|in|pass|break|continue|assert|raise|import|from|as|event|struct|interface|implements|self|log|empty|True|False|None|and|or|not|is|map)\b/,
      builtin: /\b(?:address|bool|bytes32|bytes|uint256|uint128|uint8|int128|int256|decimal|String|Bytes|HashMap|DynArray|constant|immutable|public|payable|nonpayable|view|pure|indexed|msg|block|tx|send|raw_call|create_forwarder_to|convert|len|range|concat|slice|keccak256|sha256|ecrecover|ecadd|ecmul|empty|max|min|shift|bitwise_and|bitwise_or|bitwise_xor|bitwise_not|uint2str|abs|max_value|min_value|ZERO_ADDRESS|MAX_UINT256)\b/,
      decorator: {
        pattern: /@(?:external|internal|view|pure|payable|nonreentrant|deploy|nonpayable)\b/,
        alias: 'function',
      },
    });

    // Also register Solidity (used in some docs)
    if (!PrismObject.languages.solidity) {
      PrismObject.languages.solidity = PrismObject.languages.extend('clike', {
        keyword: /\b(?:abstract|contract|interface|library|is|struct|enum|event|modifier|function|constructor|fallback|receive|mapping|address|bool|string|bytes\d*|u?int\d*|public|private|internal|external|pure|view|payable|memory|storage|calldata|returns|return|if|else|for|while|do|break|continue|emit|require|revert|assert|new|delete|this|super|virtual|override|immutable|constant|indexed|anonymous|pragma|solidity|import|using|assembly)\b/,
        builtin: /\b(?:msg|block|tx|abi|type|gasleft|blockhash|keccak256|sha256|ecrecover|addmod|mulmod|selfdestruct|balance|transfer|send|call|delegatecall|staticcall)\b/,
      });
    }

    delete globalThis.Prism;
  }
}
