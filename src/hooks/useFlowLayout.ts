const NODE_WIDTH = 350;  // Düğüm boyutunu artırdık
const NODE_HEIGHT = 180;

export function useFlowLayout(questions: Record<string, Question>): LayoutResult {
  return useMemo(() => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];
    
    // Create a new directed graph
    const g = new dagre.graphlib.Graph();
    g.setGraph({ 
      rankdir: 'TB',  // Yukarıdan aşağıya düzen
      nodesep: 150,   // Düğümler arasındaki yatay mesafeyi artırdık
      ranksep: 200,   // Düğümler arasındaki dikey mesafeyi artırdık
      edgesep: 100,   // Kenarların uzaklık mesafesini artırdık
      marginx: 50,    // Düğüm kenar mesafesini artırdık
      marginy: 50     // Düğüm kenar mesafesini artırdık
    });
    g.setDefaultEdgeLabel(() => ({}));

    // Add nodes to the graph
    Object.entries(questions).forEach(([id, question]) => {
      const node = {
        id,
        type: question.isInformational ? 'info' : question.isResult ? 'result' : 'question',
        data: { id, ...question },
        position: { x: 0, y: 0 },
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
      };
      
      nodes.push(node);
      g.setNode(id, { width: NODE_WIDTH, height: NODE_HEIGHT });

      // Add edges
      if (question.yesNext) {
        const edge = {
          id: `${id}-yes-${question.yesNext}`,
          source: id,
          target: question.yesNext,
          type: 'yes',
          label: 'Evet',
        };
        edges.push(edge);
        g.setEdge(id, question.yesNext);
      }

      if (question.noNext) {
        const edge = {
          id: `${id}-no-${question.noNext}`,
          source: id,
          target: question.noNext,
          type: 'no',
          label: 'Hayır',
        };
        edges.push(edge);
        g.setEdge(id, question.noNext);
      }
    });

    // Calculate layout
    dagre.layout(g);

    // Apply calculated positions to nodes
    nodes.forEach(node => {
      const nodeWithPosition = g.node(node.id);
      node.position = {
        x: nodeWithPosition.x - NODE_WIDTH / 2,
        y: nodeWithPosition.y - NODE_HEIGHT / 2
      };
    });

    return { nodes, edges };
  }, [questions]);
}
