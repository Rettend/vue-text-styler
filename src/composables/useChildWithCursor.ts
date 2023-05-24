export function useChildWithCursor(node: Node, cursorPosition: number) {
  let nodeEndPosition = 0
  let relativeCursorPosition = 0
  let childNode: Node | null = null

  node.childNodes.forEach((child: Node) => {
    if (child.textContent) {
      // start adding the length of the text nodes until the cursor position is reached
      if (child.textContent && nodeEndPosition < cursorPosition)
        nodeEndPosition += child.textContent.length

      // if the cursor position is reached, set the child node
      if (nodeEndPosition >= cursorPosition && !childNode) {
        childNode = child
        relativeCursorPosition = cursorPosition - (nodeEndPosition - child.textContent.length)
      }
    }
  })

  const index = Array.prototype.indexOf.call(node.childNodes, childNode)

  let textNode = node.childNodes[index]

  // nodeType: 3 is text node, 1 is element
  if (textNode && textNode.nodeType === 1)
    textNode = textNode.childNodes[0]

  return { textNode, relativeCursorPosition }
}
