INSERT INTO usuarios (nome, email, senha, criadoEm, atualizadoEm) VALUES
  ('João Silva', 'joao.silva@gmail.com', 'senha123', NOW(), NOW()),
  ('Maria Oliveira', 'maria.oliveira@gmail.com', 'senha456', NOW(), NOW()),
  ('Carlos Santos', 'carlos.santos@gmail.com', 'senha789', NOW(), NOW()),
  ('Ana Pereira', 'ana.pereira@gmail.com', 'senha456',  NOW(), NOW()),
  ('Roberto Costa', 'roberto.costa@gmail.com', 'senha123',  NOW(), NOW()),
  ('Fernanda Lima', 'fernanda.lima@gmail.com', 'senha456', NOW(), NOW()),
  ('Lucas Carvalho', 'lucas.carvalho@gmail.com', 'senha123', NOW(), NOW()),
  ('Paula Souza', 'paula.souza@gmail.com', 'senha789', NOW(), NOW()),
  ('Marcos Almeida', 'marcos.almeida@gmail.com', 'senha456', NOW(), NOW()),
  ('Julia Castro', 'julia.castro@gmail.com', 'senha123', NOW(), NOW());


INSERT INTO produtos (nome, descricao, preco, estoque, categoria, criadoEm, atualizadoEm, criadoPorId) VALUES
  ('Camisa Formal', 'Camisa branca para eventos formais', 150.00, 20, 'FORMAL', NOW(), NOW(), 3),
  ('Terno Slim', 'Terno elegante para eventos especiais', 800.00, 10, 'FORMAL', NOW(), NOW(), 3),
  ('Calça Casual', 'Calça jeans azul para o dia a dia', 100.00, 30, 'CASUAL', NOW(), NOW(), 3),
  ('Gravata Vermelha', 'Gravata ideal para ocasiões formais', 50.00, 15, 'FORMAL', NOW(), NOW(), 6),
  ('Blazer Casual', 'Blazer para uso no dia a dia', 300.00, 8, 'CASUAL', NOW(), NOW(), 6),
  ('Sapato Social', 'Sapato preto para ocasiões formais', 400.00, 10, 'FORMAL', NOW(), NOW(), 6),
  ('Jaqueta Jeans', 'Jaqueta casual para todos os momentos', 200.00, 20, 'CASUAL', NOW(), NOW(), 9),
  ('Camisa Xadrez', 'Camisa casual xadrez vermelha', 80.00, 25, 'CASUAL', NOW(), NOW(), 9),
  ('Terno Slim Preto', 'Terno slim preto para eventos formais', 850.00, 6, 'FORMAL', NOW(), NOW(), 9),
  ('Cinto de Couro', 'Cinto de couro legítimo', 70.00, 18, 'FORMAL', NOW(), NOW(), 9);

  INSERT INTO produtos (nome, descricao, preco, estoque, categoria, criadoEm, atualizadoEm, criadoPorId)
VALUES
('Terno Clássico', 'Terno formal de alta qualidade', 1500.50, 10, 'FORMAL', NOW(), NOW(), 1),
('Camisa Social', 'Camisa formal branca', 200.00, 50, 'FORMAL', NOW(), NOW(), 2),
('Gravata Slim', 'Gravata preta elegante', 120.00, 30, 'FORMAL', NOW(), NOW(), 1),
('Terno Slim Fit', 'Terno casual ajustado', 1700.00, 5, 'CASUAL', NOW(), NOW(), 3),
('Calça Social', 'Calça para eventos formais', 300.00, 20, 'FORMAL', NOW(), NOW(), 2),
('Blazer Moderno', 'Blazer casual e moderno', 900.00, 8, 'CASUAL', NOW(), NOW(), 3),
('Vestido de Noiva', 'Vestido para casamento sofisticado', 5000.00, 3, 'CASAMENTO', NOW(), NOW(), 1),
('Camisa Casual', 'Camisa casual para ocasiões descontraídas', 150.00, 25, 'CASUAL', NOW(), NOW(), 2),
('Sapato Social', 'Sapato masculino clássico', 600.00, 15, 'FORMAL', NOW(), NOW(), 3),
('Cinto de Couro', 'Cinto de couro preto', 180.00, 40, 'FORMAL', NOW(), NOW(), 1),
('Vestido Longo', 'Vestido para casamento ao ar livre', 3500.00, 2, 'CASAMENTO', NOW(), NOW(), 3),
('Smoking Clássico', 'Smoking preto com acabamento fino', 2500.00, 4, 'FORMAL', NOW(), NOW(), 1),
('Terno Casual', 'Terno leve e descontraído', 1400.00, 7, 'CASUAL', NOW(), NOW(), 2),
('Gravata Borboleta', 'Gravata borboleta estilosa', 80.00, 25, 'FORMAL', NOW(), NOW(), 1),
('Sapato Casual', 'Sapato confortável para o dia a dia', 300.00, 20, 'CASUAL', NOW(), NOW(), 2),
('Abotoaduras Elegantes', 'Par de abotoaduras de prata', 250.00, 10, 'FORMAL', NOW(), NOW(), 3),
('Vestido Curto', 'Vestido casual para eventos informais', 1200.00, 6, 'CASUAL', NOW(), NOW(), 2),
('Sapato de Casamento', 'Sapato elegante para noivas', 800.00, 3, 'CASAMENTO', NOW(), NOW(), 3),
('Terno Clássico Azul', 'Terno azul-marinho para eventos formais', 1600.00, 5, 'FORMAL', NOW(), NOW(), 1),
('Jaqueta Casual', 'Jaqueta estilosa para eventos casuais', 700.00, 10, 'CASUAL', NOW(), NOW(), 3);



INSERT INTO pedidos (usuarioId, total, status, criadoEm, atualizadoEm) VALUES
  (1, 0, 'PENDENTE', NOW(), NOW()),
  (2, 0, 'PENDENTE', NOW(), NOW()),
  (3, 0, 'PENDENTE', NOW(), NOW()),
  (4, 0, 'PAGO', NOW(), NOW()),
  (5, 0, 'ENVIADO', NOW(), NOW()),
  (6, 0, 'PENDENTE', NOW(), NOW()),
  (7, 0, 'CANCELADO', NOW(), NOW()),
  (8, 0, 'PENDENTE', NOW(), NOW()),
  (9, 0, 'PAGO', NOW(), NOW()),
  (10, 0, 'PENDENTE', NOW(), NOW());


INSERT INTO itens_pedido (pedidoId, produtoId, quantidade, preco, criadoEm) VALUES
  (1, 1, 2, 150.00, NOW()),
  (1, 2, 1, 800.00, NOW()),
  (2, 3, 3, 100.00, NOW()),
  (3, 4, 2, 50.00, NOW()),
  (4, 5, 1, 300.00, NOW()),
  (5, 6, 2, 400.00, NOW()),
  (6, 7, 1, 200.00, NOW()),
  (7, 8, 2, 80.00, NOW()),
  (8, 9, 1, 850.00, NOW()),
  (9, 10, 3, 70.00, NOW());

  


INSERT INTO logs (descricao, complemento, usuarioId, createdAt, updatedAt) VALUES
  ('Login realizado com sucesso', 'Usuário: João Silva', 1, NOW(), NOW()),
  ('Erro de senha', 'Tentativa com senha incorreta para o email maria.oliveira@gmail.com', 2, NOW(), NOW()),
  ('Produto cadastrado', 'Produto: Camisa Formal', 3, NOW(), NOW()),
  ('Pedido criado', 'Pedido ID: 1', 1, NOW(), NOW()),
  ('Produto cadastrado', 'Produto: Gravata Vermelha', 6, NOW(), NOW()),
  ('Pedido atualizado', 'Status alterado para PAGO', 5, NOW(), NOW()),
  ('Login realizado com sucesso', 'Usuário: Lucas Carvalho', 4, NOW(), NOW()),
  ('Erro de autenticação', 'Usuário: Paula Souza tentou acessar sem permissão', 8, NOW(), NOW()),
  ('Produto cadastrado', 'Produto: Jaqueta Jeans', 9, NOW(), NOW()),
  ('Pedido cancelado', 'Pedido ID: 7', 10, NOW(), NOW());


